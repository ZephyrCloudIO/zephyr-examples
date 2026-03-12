import { exec } from "node:child_process";
import { promisify } from "node:util";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { cpus } from "node:os";
import pLimit from "p-limit";
import {
  red,
  blue,
  green,
  getLogWriteStream,
  orange,
  getDateString,
} from "./utils.js";

const execAsync = promisify(exec);

// Concurrency control - limit parallel builds to prevent resource exhaustion
const MAX_CONCURRENT_BUILDS = Math.min(cpus().length, 4);
const BUILD_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const BUILD_LOG_TAIL_LINES = 20;
const ANSI_ESCAPE_REGEX = /\x1B\[[0-9;]*m/g;

// Create concurrency limiter
const limit = pLimit(MAX_CONCURRENT_BUILDS);

// Workspace directories containing examples
const WORKSPACES = ['nx', 'vanilla', 'turborepo'];

// Check if build is needed based on file timestamps
function needsBuild(folderPath: string, skipCache: boolean = false): boolean {
  if (skipCache) return true;

  try {
    const packagePath = join(folderPath, "package.json");
    const distPath = join(folderPath, "dist");

    if (!existsSync(distPath)) return true;

    const packageStat = statSync(packagePath);
    const distStat = statSync(distPath);

    // Build if package.json is newer than dist folder
    return packageStat.mtime > distStat.mtime;
  } catch {
    return true; // Build if we can't determine timestamps
  }
}

interface BuildResult {
  example: string;
  workspace: string;
  result: string;
}

interface ExampleInfo {
  name: string;
  workspace: string;
  path: string;
}

interface ExecError extends Error {
  cmd?: string;
  code?: number | string;
  killed?: boolean;
  signal?: NodeJS.Signals | string | null;
  stderr?: string;
  stdout?: string;
}

function stripAnsi(value: string): string {
  return value.replace(ANSI_ESCAPE_REGEX, "");
}

function getLogTail(stdout: string | undefined, stderr: string | undefined, message: string): string[] {
  const combined = [stdout, stderr, message]
    .filter((chunk): chunk is string => Boolean(chunk))
    .join("\n");

  return stripAnsi(combined)
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .slice(-BUILD_LOG_TAIL_LINES);
}

function isBuildTimeout(error: ExecError): boolean {
  if (error.code === "ETIMEDOUT") {
    return true;
  }

  return Boolean(error.killed && error.message.includes("timed out"));
}

function getFailureReason(error: ExecError): string {
  if (isBuildTimeout(error)) {
    return "Build timed out";
  }

  if (typeof error.code === "number") {
    return `Exit code ${error.code}`;
  }

  if (typeof error.signal === "string" && error.signal.length > 0) {
    return `Signal ${error.signal}`;
  }

  return error.message;
}

// Discover all examples across all workspaces
function discoverExamples(): ExampleInfo[] {
  const rootPath = join(__dirname, "../..");
  const allExamples: ExampleInfo[] = [];

  for (const workspace of WORKSPACES) {
    const workspacePath = join(rootPath, workspace);
    const examplesPath = join(workspacePath, "examples");

    if (!existsSync(examplesPath)) {
      console.log(`${orange(`Warning: ${workspace}/examples not found, skipping...`)}`);
      continue;
    }

    const examples = readdirSync(examplesPath);

    for (const example of examples) {
      const examplePath = join(examplesPath, example);
      const packagePath = join(examplePath, "package.json");

      // Only include if it has a package.json
      if (existsSync(packagePath)) {
        allExamples.push({
          name: example,
          workspace,
          path: examplePath,
        });
      }
    }
  }

  return allExamples;
}

const buildPackages = async (): Promise<void> => {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const skipCache = args.includes('--skip-cache');
  const packagesArg = args.find(arg => arg.startsWith('--packages='));

  let examplesToBuild: ExampleInfo[];
  let buildType: string;

  // Discover all examples
  const allExamples = discoverExamples();

  if (packagesArg) {
    // Parse comma-separated list of packages
    const packagesList = packagesArg.split('=')[1];
    const requestedExamples = packagesList ? packagesList.split(',').filter(Boolean) : [];

    if (requestedExamples.length === 0) {
      console.log(`\n${green("No examples specified - nothing to build.")}`);
      return;
    }

    // Filter examples by requested names
    examplesToBuild = allExamples.filter(ex => requestedExamples.includes(ex.name));
    buildType = "specified examples";

    console.log(`\n${orange("-- Building specified examples only ")}`);
    console.log(`${blue("Examples:")} ${examplesToBuild.map(ex => `${ex.workspace}/${ex.name}`).join(', ')}`);
  } else {
    examplesToBuild = allExamples;
    buildType = "all examples";
    console.log(`\n${orange("-- Building all examples ")}`);
    console.log(`${blue("Total examples found:")} ${examplesToBuild.length}`);

    // Show breakdown by workspace
    const byWorkspace = examplesToBuild.reduce((acc, ex) => {
      acc[ex.workspace] = (acc[ex.workspace] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(byWorkspace).forEach(([workspace, count]) => {
      console.log(`  ${blue(workspace)}: ${count} examples`);
    });
  }

  console.log(`${blue("Max concurrent builds:")} ${MAX_CONCURRENT_BUILDS}`);
  if (skipCache) {
    console.log(`${orange("Cache skipped - forcing rebuild of all packages")}`);
  }
  console.log();

  const logFolder = join(__dirname, "../tmp/build", getDateString());
  const success: BuildResult[] = [];
  const fails: BuildResult[] = [];
  const skipped: BuildResult[] = [];

  const startTime = Date.now();

  await Promise.all(
    examplesToBuild.map((example) =>
      limit(async () => {
        const { name, workspace, path: folderPath } = example;
        const displayName = `${workspace}/${name}`;
        const packagePath = join(folderPath, "package.json");

        const packageJson = JSON.parse(readFileSync(packagePath, "utf-8")) as { scripts?: { build?: string } };
        if (!packageJson.scripts?.build) {
          fails.push({ example: displayName, workspace, result: "No build script." });
          return;
        }

        // Check if build is needed (simple caching)
        if (!needsBuild(folderPath, skipCache)) {
          console.log(`[${blue(displayName)}] ${green("skipped - up to date")}`);
          skipped.push({ example: displayName, workspace, result: "Build cache hit" });
          return;
        }

        const writeStream = await getLogWriteStream(`${workspace}-${name}`, logFolder);
        const logPath = join(logFolder, `${workspace}-${name}.txt`);
        console.log(`Building [${blue(displayName)}] project...`);

        const buildStart = Date.now();

        try {
          // Use async exec with timeout instead of blocking execSync
          const { stdout, stderr } = await execAsync(`pnpm run build`, {
            cwd: folderPath,
            timeout: BUILD_TIMEOUT,
          });

          // Write output to log file
          if (stdout) writeStream.write(stdout);
          if (stderr) writeStream.write(stderr);
          writeStream.end();

          const buildTime = Date.now() - buildStart;
          console.log(
            `[${blue(displayName)}] ${green(
              "successfully built!"
            )} (${buildTime}ms)`
          );
          success.push({
            example: displayName,
            workspace,
            result: `Successfully built in ${buildTime}ms (${logPath})`,
          });
        } catch (rawError: unknown) {
          const error = rawError as ExecError;
          const buildTime = Date.now() - buildStart;
          const logTail = getLogTail(error.stdout, error.stderr, error.message);

          // Write error output to log file
          if (error.stdout) writeStream.write(error.stdout);
          if (error.stderr) writeStream.write(error.stderr);
          writeStream.write(`\nError: ${error.message}\n`);
          writeStream.end();

          console.log(
            `[${blue(displayName)}] ${red(
              `failed to build after ${buildTime}ms.`
            )}`
          );
          console.log(`[${blue(displayName)}] ${orange(`reason:`)} ${getFailureReason(error)}`);
          console.log(`[${blue(displayName)}] ${orange("log file:")} ${logPath}`);
          if (logTail.length > 0) {
            console.log(`[${blue(displayName)}] ${orange(`last ${logTail.length} log lines:`)}`);
            for (const line of logTail) {
              console.log(`  ${line}`);
            }
          }

          fails.push({
            example: displayName,
            workspace,
            result: `${getFailureReason(error)} (${logPath})`,
          });
        }
      })
    )
  );

  const totalTime = Date.now() - startTime;
  console.log(`\n${green(`-- Build completed in ${totalTime}ms --`)}`);

  if (success.length) {
    console.log(`\n${green(`-- Successfully built ${buildType}:`)}`);
    success.forEach(({ example, result }) =>
      console.log(`[${blue(example)}]: ${result}`)
    );
  }

  if (skipped.length) {
    console.log(`\n${blue("-- Skipped examples (up to date):")}`);
    skipped.forEach(({ example, result }) =>
      console.log(`[${blue(example)}]: ${result}`)
    );
  }

  if (fails.length) {
    console.log(`\n${red("-- Failed to build examples:")}`);
    fails.forEach(({ example, result }) =>
      console.log(`[${orange(example)}]: ${result}`)
    );
  }

  console.log(`\nCheck build run logs under '${logFolder}'`);

  // Exit with code 1 if any builds failed
  if (fails.length > 0) {
    process.exit(1);
  }
};

buildPackages();
