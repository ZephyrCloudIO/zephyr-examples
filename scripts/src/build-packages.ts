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
import { getAllAppDeployResults } from "zephyr-agent";

const execAsync = promisify(exec);

// Concurrency control - limit parallel builds to prevent resource exhaustion
const MAX_CONCURRENT_BUILDS = Math.min(cpus().length, 4);
const BUILD_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Create concurrency limiter
const limit = pLimit(MAX_CONCURRENT_BUILDS);

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
  result: string;
}

const buildPackages = async (): Promise<void> => {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const skipCache = args.includes('--skip-cache');
  const packagesArg = args.find(arg => arg.startsWith('--packages='));
  
  let examples: string[];
  let buildType: string;
  
  if (packagesArg) {
    // Parse comma-separated list of packages
    const packagesList = packagesArg.split('=')[1];
    examples = packagesList ? packagesList.split(',').filter(Boolean) : [];
    buildType = "specified examples";
    
    if (examples.length === 0) {
      console.log(`\n${green("No examples specified - nothing to build.")}`);
      return;
    }
    
    console.log(`\n${orange("-- Building specified examples only ")}`);
    console.log(`${blue("Examples:")} ${examples.join(', ')}`);
  } else {
    const examplesFolder = join(__dirname, "../../examples");
    examples = readdirSync(examplesFolder);
    buildType = "all examples";
    console.log(`\n${orange("-- Building all examples ")}`);
  }
  
  console.log(`${blue("Max concurrent builds:")} ${MAX_CONCURRENT_BUILDS}`);
  if (skipCache) {
    console.log(`${orange("Cache skipped - forcing rebuild of all packages")}`);
  }
  console.log();

  const logFolder = join(__dirname, "../tmp/build", getDateString());
  const examplesFolder = join(__dirname, "../../examples");
  const success: BuildResult[] = [];
  const fails: BuildResult[] = [];
  const skipped: BuildResult[] = [];

  const startTime = Date.now();

  await Promise.all(
    examples.map((example) =>
      limit(async () => {
        const folderPath = join(examplesFolder, example);
        const packagePath = join(folderPath, "package.json");
        const packageExists = existsSync(packagePath);

        if (!packageExists) {
          fails.push({ example, result: "No package.json found." });
          return;
        }

        const packageJson = JSON.parse(readFileSync(packagePath, "utf-8")) as { scripts?: { build?: string } };
        if (!packageJson.scripts?.build) {
          fails.push({ example, result: "No build script." });
          return;
        }

        // Check if build is needed (simple caching)
        if (!needsBuild(folderPath, skipCache)) {
          console.log(`[${blue(example)}] ${green("skipped - up to date")}`);
          skipped.push({ example, result: "Build cache hit" });
          return;
        }

        const writeStream = await getLogWriteStream(example, logFolder);
        console.log(`Building [${blue(example)}] project...`);

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
            `[${blue(example)}] ${green(
              "successfully built!"
            )} (${buildTime}ms)`
          );
          success.push({
            example,
            result: `Successfully built in ${buildTime}ms`,
          });
        } catch (e: any) {
          // Write error output to log file
          if (e.stdout) writeStream.write(e.stdout);
          if (e.stderr) writeStream.write(e.stderr);
          writeStream.write(`\nError: ${e.message}\n`);
          writeStream.end();

          console.log(`[${blue(example)}] ${red("failed to build.")}`);
          fails.push({
            example,
            result:
              e.code === "ETIMEDOUT"
                ? "Build timeout"
                : `Build error: ${e.message}`,
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

    if (buildType === "all examples") {
      const deployed = await getDeployed();
      console.log(`\n${green("-- Applications deployed:")}`);
      deployed.forEach(({ app, url }) => {
        console.log(`[${blue(app)}]: ${url}`);
      });
    }
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
};

interface DeployedApp {
  app: string;
  url: string;
}

const getDeployed = async (): Promise<DeployedApp[]> => {
  try {
    const deployResults = await getAllAppDeployResults();
    const deployed = Object.entries(deployResults).map(([app, result]: [string, any]) => ({
      app: app.split('.')[0],
      url: result.urls[0],
    }));
    deployed.sort((a, b) => (a.app > b.app ? 1 : -1));
    return deployed;
  } catch (error: any) {
    console.log(`${red("Failed to get deployment results:")} ${error.message}`);
    return [];
  }
};

buildPackages();
