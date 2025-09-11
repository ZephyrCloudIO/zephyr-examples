import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { green, red, orange } from "./utils.js";
import { load, dump } from "js-yaml";

const log = {
  success: (message: string) => console.log(green(message)),
  error: (message: string) => console.error(red(message)),
  warning: (message: string) => console.warn(orange(message)),
};

const getNextVersion = async (): Promise<string> => {
  try {
    log.warning("Fetching next tag version for zephyr-rspack-plugin...");
    const result = execSync("npm view zephyr-rspack-plugin dist-tags.next", {
      encoding: "utf-8",
    });
    return result.trim();
  } catch (error) {
    log.error("Failed to fetch next version, falling back to latest...");
    try {
      const result = execSync("npm view zephyr-rspack-plugin version", {
        encoding: "utf-8",
      });
      return result.trim();
    } catch (fallbackError) {
      log.error("Failed to fetch any version information.");
      process.exit(1);
    }
  }
};

const updateWorkspaceCatalog = (version: string): void => {
  const workspacePath = join(__dirname, "../../pnpm-workspace.yaml");

  if (!existsSync(workspacePath)) {
    log.error("pnpm-workspace.yaml not found!");
    process.exit(1);
  }

  try {
    const content = readFileSync(workspacePath, "utf-8");
    const doc = load(content) as any;

    if (!doc.catalogs || !doc.catalogs.zephyr) {
      log.error("No zephyr catalog found in pnpm-workspace.yaml");
      process.exit(1);
    }

    const zephyrPlugins = Object.keys(doc.catalogs.zephyr);
    console.log(
      `Found ${
        zephyrPlugins.length
      } plugins in zephyr catalog: ${zephyrPlugins.join(", ")}`
    );

    // Update all zephyr plugin versions
    zephyrPlugins.forEach((plugin) => {
      doc.catalogs.zephyr[plugin] = `^${version}`;
    });

    const updatedYaml = dump(doc, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false,
    });

    writeFileSync(workspacePath, updatedYaml, "utf-8");
    log.success(`Updated pnpm-workspace.yaml catalog with version ${version}`);
  } catch (error: any) {
    log.error(`Failed to update pnpm-workspace.yaml: ${error.message}`);
    process.exit(1);
  }
};

const upgradePlugins = async (): Promise<void> => {
  if (["--help", "-h"].includes(process.argv[2])) {
    console.log(
      `\nExecute script to upgrade zephyr plugins to next tag version: 'pnpm upgrade-plugins'\n`
    );
    process.exit();
  }

  const version = await getNextVersion();
  console.log(`\n-- Upgrading plugins to version: ${version}\n`);

  updateWorkspaceCatalog(version);

  // Run pnpm install to update all dependencies
  log.warning("Running pnpm install to update dependencies...");
  try {
    execSync("pnpm install", {
      cwd: join(__dirname, "../.."),
      stdio: "inherit",
    });
    log.success("Successfully updated all dependencies!");
  } catch (error: any) {
    log.error("Failed to run pnpm install:");
    console.error(error.message);
    process.exit(1);
  }
};

upgradePlugins();
