import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { green, red, orange, blue } from "./utils.js";

const log = {
  success: (message: string) => console.log(green(message)),
  error: (message: string) => console.error(red(message)),
  warning: (message: string) => console.warn(orange(message)),
  info: (message: string) => console.log(blue(message)),
};

// Category directories containing examples
const CATEGORIES = ['bundlers', 'module-federation', 'frameworks', 'server', 'build-systems'];

// Zephyr packages to upgrade
const ZEPHYR_PACKAGES = [
  'parcel-reporter-zephyr',
  'rollup-plugin-zephyr',
  'vite-plugin-tanstack-start-zephyr',
  'vite-plugin-vinext-zephyr',
  'vite-plugin-zephyr',
  'zephyr-agent',
  'zephyr-astro-integration',
  'zephyr-edge-contract',
  'zephyr-metro-plugin',
  'zephyr-modernjs-plugin',
  'zephyr-repack-plugin',
  'zephyr-rolldown-plugin',
  'zephyr-rsbuild-plugin',
  'zephyr-rspack-plugin',
  'zephyr-rspress-plugin',
  'zephyr-webpack-plugin',
];

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

interface PackageUpdate {
  filePath: string;
  package: string;
  oldVersion: string;
  newVersion: string;
}

// Find all package.json files with Zephyr packages
function findZephyrPackages(rootPath: string): PackageUpdate[] {
  const updates: PackageUpdate[] = [];

  for (const category of CATEGORIES) {
    const categoryPath = join(rootPath, category);

    if (!existsSync(categoryPath)) {
      log.warning(`Category ${category}/ not found, skipping...`);
      continue;
    }

    const examples = readdirSync(categoryPath);

    for (const example of examples) {
      const examplePath = join(categoryPath, example);
      const packagePath = join(examplePath, "package.json");

      if (!existsSync(packagePath)) continue;

      try {
        const content = readFileSync(packagePath, "utf-8");
        const packageJson = JSON.parse(content);

        // Check all dependency types
        const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

        for (const depType of depTypes) {
          if (!packageJson[depType]) continue;

          for (const zephyrPkg of ZEPHYR_PACKAGES) {
            if (packageJson[depType][zephyrPkg]) {
              updates.push({
                filePath: packagePath,
                package: zephyrPkg,
                oldVersion: packageJson[depType][zephyrPkg],
                newVersion: '', // Will be filled later
              });
            }
          }
        }
      } catch (error) {
        log.error(`Failed to read ${packagePath}: ${error}`);
      }
    }
  }

  // Also check scripts/package.json
  const scriptsPackagePath = join(rootPath, 'scripts', 'package.json');
  if (existsSync(scriptsPackagePath)) {
    try {
      const content = readFileSync(scriptsPackagePath, "utf-8");
      const packageJson = JSON.parse(content);

      const depTypes = ['dependencies', 'devDependencies'];
      for (const depType of depTypes) {
        if (!packageJson[depType]) continue;

        for (const zephyrPkg of ZEPHYR_PACKAGES) {
          if (packageJson[depType][zephyrPkg]) {
            updates.push({
              filePath: scriptsPackagePath,
              package: zephyrPkg,
              oldVersion: packageJson[depType][zephyrPkg],
              newVersion: '', // Will be filled later
            });
          }
        }
      }
    } catch (error) {
      log.error(`Failed to read scripts/package.json: ${error}`);
    }
  }

  return updates;
}

// Update package.json files with new version
function updatePackageVersions(updates: PackageUpdate[], version: string): number {
  const updatedFiles = new Set<string>();

  for (const update of updates) {
    try {
      const content = readFileSync(update.filePath, "utf-8");
      const packageJson = JSON.parse(content);

      // Update in all dependency types
      const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
      let fileModified = false;

      for (const depType of depTypes) {
        if (packageJson[depType] && packageJson[depType][update.package]) {
          packageJson[depType][update.package] = version;
          fileModified = true;
        }
      }

      if (fileModified) {
        writeFileSync(update.filePath, JSON.stringify(packageJson, null, 2) + '\n', "utf-8");
        updatedFiles.add(update.filePath);
      }
    } catch (error: any) {
      log.error(`Failed to update ${update.filePath}: ${error.message}`);
    }
  }

  return updatedFiles.size;
}

const parseVersion = (): string | null => {
  const versionArg = process.argv.find(arg => arg.startsWith('--version='));
  return versionArg ? versionArg.split('=')[1] : null;
};

const upgradePlugins = async (): Promise<void> => {
  if (["--help", "-h"].includes(process.argv[2])) {
    console.log(
      `\nExecute script to upgrade zephyr plugins to next tag version: 'pnpm upgrade-plugins'\n` +
      `Options:\n` +
      `  --version=X.X.X  Specify version to upgrade to (default: next tag)\n` +
      `  --version=latest Use "latest" as version\n`
    );
    process.exit();
  }

  const rootPath = join(__dirname, "../..");
  const specifiedVersion = parseVersion();
  let version: string;

  // Check if version is a dist-tag (no dots, typically "latest", "next", "beta", etc.)
  const isDistTag = (v: string) => !/^\d+\.\d+/.test(v);

  if (specifiedVersion) {
    // Don't add caret to dist-tags
    version = isDistTag(specifiedVersion) ? specifiedVersion : `^${specifiedVersion}`;
    log.info(`Using specified version: ${version}`);
  } else {
    const fetchedVersion = await getNextVersion();
    version = `^${fetchedVersion}`;
    log.info(`Using fetched next version: ${version}`);
  }

  console.log(`\n-- Upgrading plugins to version: ${version}\n`);

  // Find all package.json files with Zephyr packages
  const updates = findZephyrPackages(rootPath);

  if (updates.length === 0) {
    log.warning("No Zephyr packages found to upgrade.");
    return;
  }

  log.info(`Found ${updates.length} Zephyr package reference(s) to update`);

  // Group by file for display
  const byFile = updates.reduce((acc, update) => {
    const relativePath = update.filePath.replace(rootPath + '/', '');
    if (!acc[relativePath]) acc[relativePath] = [];
    acc[relativePath].push(update.package);
    return acc;
  }, {} as Record<string, string[]>);

  console.log("\nPackages to update:");
  Object.entries(byFile).forEach(([file, packages]) => {
    console.log(`  ${blue(file)}: ${packages.join(', ')}`);
  });
  console.log();

  // Update all package.json files
  const filesUpdated = updatePackageVersions(updates, version);
  log.success(`Updated ${filesUpdated} package.json file(s)`);

  // Run pnpm install at workspace root to regenerate the lockfile
  log.warning("\nRunning pnpm install at workspace root to update lockfile...");

  try {
    execSync("pnpm install --no-frozen-lockfile", {
      cwd: rootPath,
      stdio: "inherit",
    });
  } catch (error: any) {
    log.error(`Failed to run pnpm install at workspace root:`);
    console.error(error.message);
  }

  log.success("\n✓ Successfully updated all dependencies!");
};

upgradePlugins();
