const { execSync } = require("node:child_process");
const {
  readdirSync,
  readFileSync,
  existsSync,
  createWriteStream,
  writeFileSync,
  mkdirSync,
} = require("node:fs");
const { join } = require("node:path");

const pluginNames = [
  "rollup-plugin-zephyr",
  "vite-plugin-zephyr",
  "zephyr-repack-plugin",
  "zephyr-rspack-plugin",
  "zephyr-webpack-plugin",
];

const upgradePlugins = async () => {
  const cmdEx = "'node upgrade-plugins.js 0.0.1'";
  const version = process.argv[2];

  if (["--help", "-h"].includes(version)) {
    console.log(`\nExecute script and provide a version. i.e.: ${cmdEx}`);
    process.exit();
  }

  if (!version) {
    console.log(`\nNo version was provided. i.e.: ${cmdEx}`);
    process.exit(1);
  }

  console.log(`\n${orange('-- Upgrading plugins to version: ')}${green(version)}\n`)
  const examplesFolder = join(__dirname, "../examples");
  const folders = readdirSync(examplesFolder);
  const logFolder = join(__dirname, "/tmp", Date.now().toString());

  mkdirSync(logFolder, { recursive: true });
  const success = [];
  const fails = [];

  await Promise.all(
    folders.map(async (folder) => {
      try {
        const folderPath = join(examplesFolder, folder);
        const packagePath = join(folderPath, "package.json");
        const packageExists = existsSync(packagePath);
        const isPnpmWorkspace = existsSync(
          join(folderPath, "pnpm-workspace.yaml")
        );

        if (!packageExists) {
          return fails.push({ app: folder, result: "No packages.json found." });
        }

        const package = JSON.parse(readFileSync(packagePath, "utf-8"));
        const { dependencies, devDependencies } = package;
        const isNpm = existsSync(join(folderPath, "package-lock.json"));
        let deps = [];
        deps = deps.concat(
          dependencies ? Object.keys(dependencies) : [],
          devDependencies ? Object.keys(devDependencies) : []
        );
        const plugins = deps.filter((dep) => pluginNames.includes(dep));

        if (!plugins.length) {
          return fails.push({ app: folder, result: "No plugin installed." });
        }
        writeFileSync(`${logFolder}/${folder}.txt`, "utf-8");
        const writeStream = await new Promise((resolve) => {
          createWriteStream(`${logFolder}/${folder}.txt`).on("open", resolve);
        });
        console.log(`Upgrading [${blue(folder)}] project...`);
        execSync(
          `${isNpm ? "npm" : "pnpm"} i -D ` +
            `${isPnpmWorkspace ? "-w " : ""}` +
            plugins.map((plugin) => `${plugin}@${version}`).join(" "),
          { cwd: folderPath, stdio: [writeStream, writeStream, writeStream] }
        );
        console.log(`[${blue(folder)}] ${green('successfully upgraded!')}`);
        success.push({
          app: folder,
          result: `${plugins.join(", ")} upgraded to ${version}`,
        });
      } catch (e) {
        console.log(`[${blue(folder)}] ${red('failed to upgrade.')}`);
        fails.push({
          app: folder,
          result: `Unexpected error: ${JSON.stringify(e)}`,
        });
      }
    })
  );
  if (success.length) {
    console.log(`\n${green('-- Successfully upgraded plugins:')}`);
    success.forEach(({ app, result }) => console.log(`[${blue(app)}]: ${result}`));
  }

  if (fails.length) {
    console.log(`\n${red('-- Failed to upgrade projects:')}`);
    fails.forEach(({ app, result }) => console.log(`[${yellow(app)}]: ${result}`));
  }

  console.log('')
};

const orange = (txt) => `\x1b[0;33m${txt}\x1b[0m`
const blue = (txt) => `\x1b[1;34m${txt}\x1b[0m`
const yellow = (txt) => `\x1b[1;33m${txt}\x1b[0m`
const green = (txt) => `\x1b[0;32m${txt}\x1b[0m`
const red = (txt) => `\x1b[31m${txt}\x1b[0m`

upgradePlugins();
