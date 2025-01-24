const { execSync } = require("node:child_process");
const { readdirSync, readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const {
  green,
  blue,
  red,
  yellow,
  getLogWriteStream,
  getDateString,
  orange,
} = require("./utils");

const upgradePlugins = async () => {
  const cmdEx = "'pnpm upgrade-plugins 0.0.1'";
  const version = process.argv[2];

  if (["--help", "-h"].includes(version)) {
    console.log(`\nExecute script and provide a version. i.e.: ${cmdEx}`);
    process.exit();
  }

  if (!version) {
    console.log(`\n${red('No version was provided.')} i.e.: ${cmdEx}\n`);
    process.exit(1);
  }

  console.log(
    `\n${orange("-- Upgrading plugins to version: ")}${green(version)}\n`
  );
  const logFolder = join(__dirname, "../tmp/upgrade", getDateString());
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

        const plugins = getInstalledPlugins(packagePath);

        if (!plugins.length) {
          return fails.push({ example, result: "No plugin installed." });
        }

        const isPnpmWs = existsSync(join(folderPath, "pnpm-workspace.yaml"));
        const isNpm = existsSync(join(folderPath, "package-lock.json"));
        const writeStream = await getLogWriteStream(example, logFolder);
        const command =
          `${isNpm ? "npm" : "pnpm"} i -D ` +
          `${isPnpmWs ? "-w " : ""}` +
          plugins.map((plugin) => `${plugin}@${version}`).join(" ");

        console.log(`Upgrading [${blue(example)}] project...`);
        execSync(command, {
          cwd: folderPath,
          stdio: [writeStream, writeStream, writeStream],
        });
        console.log(`[${blue(example)}] ${green("successfully upgraded!")}`);

        success.push({
          example,
          result: `${plugins.join(", ")} upgraded to ${version}`,
        });
      } catch (e) {
        console.log(`[${blue(example)}] ${red("failed to upgrade.")}`);
        fails.push({
          example,
          result: `Unexpected error: ${JSON.stringify(e)}`,
        });
      }
    })
  );

  if (success.length) {
    console.log(`\n${green("-- Successfully upgraded plugins:")}`);
    success.forEach(({ example, result }) =>
      console.log(`[${blue(example)}]: ${result}`)
    );
  }

  if (fails.length) {
    console.log(`\n${red("-- Failed to upgrade projects:")}`);
    fails.forEach(({ example, result }) =>
      console.log(`[${orange(example)}]: ${result}`)
    );
  }

  console.log(`\nCheck all installation logs under: '${logFolder}'`);
};

const pluginNames = [
  "rollup-plugin-zephyr",
  "vite-plugin-zephyr",
  "zephyr-repack-plugin",
  "zephyr-rspack-plugin",
  "zephyr-webpack-plugin",
];

const getInstalledPlugins = (packagePath) => {
  const package = JSON.parse(readFileSync(packagePath, "utf-8"));
  const { dependencies, devDependencies } = package;
  let deps = [];
  deps = deps.concat(
    dependencies ? Object.keys(dependencies) : [],
    devDependencies ? Object.keys(devDependencies) : []
  );
  return deps.filter((dep) => pluginNames.includes(dep));
};

upgradePlugins();
