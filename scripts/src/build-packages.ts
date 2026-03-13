import { spawn } from "node:child_process";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { cpus } from "node:os";
import type { WriteStream } from "node:fs";
import pLimit from "p-limit";
import {
  red,
  blue,
  green,
  getLogWriteStream,
  orange,
  getDateString,
} from "./utils.js";

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

interface BuildCommandResult {
  stderr: string;
  stdout: string;
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

function logBuildOutput(displayName: string, streamName: "stdout" | "stderr", buffer: string): string {
  const lines = buffer.split(/\r?\n/);
  const remainder = lines.pop() ?? "";

  for (const line of lines) {
    console.log(`[${blue(displayName)}][${streamName}] ${line}`);
  }

  return remainder;
}

function flushBuildOutput(displayName: string, streamName: "stdout" | "stderr", remainder: string): void {
  if (remainder.length > 0) {
    console.log(`[${blue(displayName)}][${streamName}] ${remainder}`);
  }
}

function runBuildCommand(
  folderPath: string,
  displayName: string,
  writeStream: WriteStream,
): Promise<BuildCommandResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["run", "build"], {
      cwd: folderPath,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let stdoutRemainder = "";
    let stderrRemainder = "";
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, BUILD_TIMEOUT);

    child.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stdout += text;
      writeStream.write(text);
      stdoutRemainder = logBuildOutput(displayName, "stdout", stdoutRemainder + text);
    });

    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderr += text;
      writeStream.write(text);
      stderrRemainder = logBuildOutput(displayName, "stderr", stderrRemainder + text);
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      writeStream.write(`\nError: ${error.message}\n`);
      writeStream.end();
      reject(error);
    });

    child.on("close", (code, signal) => {
      clearTimeout(timeout);
      flushBuildOutput(displayName, "stdout", stdoutRemainder);
      flushBuildOutput(displayName, "stderr", stderrRemainder);

      if (!timedOut && code === 0) {
        writeStream.end();
        resolve({ stdout, stderr });
        return;
      }

      const error = new Error(
        timedOut
          ? `pnpm run build timed out after ${BUILD_TIMEOUT}ms`
          : `pnpm run build exited with code ${code ?? "unknown"}${signal ? ` (${signal})` : ""}`,
      ) as ExecError;
      error.cmd = "pnpm run build";
      error.code = timedOut ? "ETIMEDOUT" : code ?? undefined;
      error.killed = timedOut;
      error.signal = signal;
      error.stdout = stdout;
      error.stderr = stderr;
      writeStream.write(`\nError: ${error.message}\n`);
      writeStream.end();
      reject(error);
    });
  });
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
          await runBuildCommand(folderPath, displayName, writeStream);

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
