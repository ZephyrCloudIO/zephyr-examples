const { exec } = require("node:child_process");
const { promisify } = require("node:util");
const { readdirSync, readFileSync, existsSync, statSync } = require("node:fs");
const { join } = require("node:path");
const { cpus } = require("node:os");
const execAsync = promisify(exec);
const {
  red,
  blue,
  green,
  getLogWriteStream,
  orange,
  getDateString,
} = require("./utils");
const { getAllAppDeployResults } = require("zephyr-agent");

// Concurrency control - limit parallel builds to prevent resource exhaustion
const MAX_CONCURRENT_BUILDS = Math.min(cpus().length, 4);
const BUILD_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Simple semaphore for controlling concurrency
class Semaphore {
  constructor(capacity) {
    this.capacity = capacity;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    return new Promise((resolve) => {
      if (this.current < this.capacity) {
        this.current++;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      this.current++;
      resolve();
    }
  }
}

// Check if build is needed based on file timestamps
function needsBuild(folderPath) {
  try {
    const packagePath = join(folderPath, 'package.json');
    const distPath = join(folderPath, 'dist');
    
    if (!existsSync(distPath)) return true;
    
    const packageStat = statSync(packagePath);
    const distStat = statSync(distPath);
    
    // Build if package.json is newer than dist folder
    return packageStat.mtime > distStat.mtime;
  } catch {
    return true; // Build if we can't determine timestamps
  }
}

const buildPackages = async () => {
  console.log(`\n${orange("-- Building all examples ")}`);
  console.log(`${blue("Max concurrent builds:")} ${MAX_CONCURRENT_BUILDS}\n`);
  
  const logFolder = join(__dirname, "../tmp/build", getDateString());
  const examplesFolder = join(__dirname, "../../examples");
  const examples = readdirSync(examplesFolder);
  const success = [];
  const fails = [];
  const skipped = [];
  const semaphore = new Semaphore(MAX_CONCURRENT_BUILDS);
  
  const startTime = Date.now();

  await Promise.all(
    examples.map(async (example) => {
      await semaphore.acquire();
      
      try {
        const folderPath = join(examplesFolder, example);
        const packagePath = join(folderPath, "package.json");
        const packageExists = existsSync(packagePath);

        if (!packageExists) {
          fails.push({ example, result: "No package.json found." });
          return;
        }
        
        const package = JSON.parse(readFileSync(packagePath, "utf-8"));
        if (!package.scripts?.build) {
          fails.push({ example, result: "No build script." });
          return;
        }

        // Check if build is needed (simple caching)
        if (!needsBuild(folderPath)) {
          console.log(`[${blue(example)}] ${green("skipped - up to date")}`);
          skipped.push({ example, result: "Build cache hit" });
          return;
        }

        const writeStream = await getLogWriteStream(example, logFolder);
        console.log(`Building [${blue(example)}] project...`);
        
        const buildStart = Date.now();
        
        // Use async exec with timeout instead of blocking execSync
        await execAsync(`pnpm run build`, {
          cwd: folderPath,
          timeout: BUILD_TIMEOUT,
          stdio: 'pipe'
        });
        
        const buildTime = Date.now() - buildStart;
        console.log(`[${blue(example)}] ${green("successfully built!")} (${buildTime}ms)`);
        success.push({ example, result: `Successfully built in ${buildTime}ms` });
        
      } catch (e) {
        console.log(`[${blue(example)}] ${red("failed to build.")}`);
        fails.push({
          example,
          result: e.code === 'ETIMEDOUT' ? 'Build timeout' : `Build error: ${e.message}`,
        });
      } finally {
        semaphore.release();
      }
    })
  );

  const totalTime = Date.now() - startTime;
  console.log(`\n${green(`-- Build completed in ${totalTime}ms --`)}`);
  
  if (success.length) {
    console.log(`\n${green("-- Successfully built examples:")}`);
    success.forEach(({ example, result }) =>
      console.log(`[${blue(example)}]: ${result}`)
    );

    const deployed = await getDeployed();
    console.log(`\n${green("-- Applications deployed:")}`);
    deployed.forEach(({ app, url }) => {
      console.log(`[${blue(app)}]: ${url}`);
    });
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

const getDeployed = async () => {
  try {
    const deployResults = await getAllAppDeployResults();
    const deployed = Object.entries(deployResults).map(([app, result]) => ({
      app: app.replace('.', ''),
      url: result.urls[0]
    }));
    deployed.sort((a, b) => (a.app > b.app ? 1 : -1));
    return deployed;
  } catch (error) {
    console.log(`${red("Failed to get deployment results:")} ${error.message}`);
    return [];
  }
};

buildPackages();
