const persist = require("node-persist");
const { execSync } = require("node:child_process");
const { readdirSync, readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const {
  yellow,
  red,
  blue,
  green,
  getLogWriteStream,
  orange,
  getDateString,
} = require("./utils");
const { homedir } = require("node:os");

const buildPackages = async () => {
  console.log(`\n${orange("-- Building all examples ")}\n`);
  const logFolder = join(__dirname, "../tmp/build", getDateString());
  const examplesFolder = join(__dirname, "../../examples");
  const examples = readdirSync(examplesFolder);
  const success = [];
  const fails = [];

  await Promise.all(
    examples.map(async (example) => {
      try {
        const folderPath = join(examplesFolder, example);
        const packagePath = join(folderPath, "package.json");
        const packageExists = existsSync(packagePath);

        if (!packageExists) {
          return fails.push({ example, result: "No package.json found." });
        }
        const package = JSON.parse(readFileSync(packagePath, "utf-8"));

        if (!package.scripts?.build) {
          return fails.push({ example, result: "No build script." });
        }
        const writeStream = await getLogWriteStream(example, logFolder);

        const isNpm = existsSync(join(folderPath, "package-lock.json"));
        const pm = isNpm ? "npm" : "pnpm";
        console.log(`Building [${blue(example)}] project...`);
        execSync(`${pm} run build`, {
          cwd: folderPath,
          stdio: [writeStream, writeStream, writeStream],
        });
        console.log(`[${blue(example)}] ${green("successfully built!")}`);

        success.push({ example, result: `Successfully built` });
      } catch (e) {
        console.log(`[${blue(example)}] ${red("failed to build.")}`);
        fails.push({
          example,
          result: `Unexpected error: ${JSON.stringify(e)}`,
        });
      }
    })
  );

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

  if (fails.length) {
    console.log(`\n${red("-- Failed to build examples:")}`);
    fails.forEach(({ example, result }) =>
      console.log(`[${orange(example)}]: ${result}`)
    );
  }

  console.log(`\nCheck build run logs under '${logFolder}'`);
};

const getDeployed = async () => {
  await persist.init({ dir: join(homedir(), ".zephyr") });
  const deployed = [];
  await persist.forEach(async ({ key, value }) => {
    if (!key.startsWith("ze-app-deploy-result:")) return;
    deployed.push({ app: key.split(":")[1].split(".")[0], url: value.urls[0] });
  });
  deployed.sort((a, b) => (a.app > b.app ? 1 : -1));
  return deployed;
};

buildPackages();
