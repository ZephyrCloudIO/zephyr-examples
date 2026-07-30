import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const fixtureRoot = new URL('../', import.meta.url);
const fixturePath = fixtureRoot.pathname;

const expectedVersions = {
  '@module-federation/rsbuild-plugin': '2.8.0',
  '@rsbuild/core': '2.1.8',
  '@rsbuild/plugin-react': '2.1.0',
  '@types/node': '24.5.2',
  '@types/react': '19.2.14',
  '@types/react-dom': '19.2.3',
  react: '19.2.7',
  'react-dom': '19.2.7',
  typescript: '6.0.3',
  'zephyr-agent': '1.2.0',
  'zephyr-cli': '1.2.0',
  'zephyr-rsbuild-plugin': '1.2.0',
};

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, fixtureRoot), 'utf8'));
}

async function installedVersion(packageName) {
  for (const workspacePath of ['', 'apps/host', 'apps/header', 'apps/hero']) {
    const packagePath = join(
      fixturePath,
      workspacePath,
      'node_modules',
      packageName,
      'package.json',
    );
    if (existsSync(packagePath)) {
      const manifest = JSON.parse(await readFile(packagePath, 'utf8'));
      if (manifest.name === packageName) {
        return manifest.version;
      }
    }
  }

  throw new Error(`Could not locate installed manifest for ${packageName}`);
}

for (const [packageName, expectedVersion] of Object.entries(expectedVersions)) {
  const actualVersion = await installedVersion(packageName);
  if (actualVersion !== expectedVersion) {
    throw new Error(
      `Installed ${packageName}@${actualVersion}; expected ${expectedVersion}`,
    );
  }
}

const lockfile = await readFile(new URL('pnpm-lock.yaml', fixtureRoot), 'utf8');
for (const [packageName, expectedVersion] of Object.entries(expectedVersions)) {
  const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const declaredAndLocked = new RegExp(
    `['"]?${escapedPackageName}['"]?:[\\s\\S]{0,160}specifier: ${expectedVersion.replaceAll('.', '\\.')}`,
  );
  if (!declaredAndLocked.test(lockfile)) {
    throw new Error(
      `Lockfile does not contain the declared ${packageName}@${expectedVersion} pin`,
    );
  }
}

const hostPackage = await readJson('apps/host/package.json');
const dependencyAliases = Object.keys(
  hostPackage['zephyr:dependencies'],
).sort();
if (dependencyAliases.join(',') !== 'header,hero') {
  throw new Error('Host Zephyr dependency aliases must be header and hero.');
}

const hostConfig = await readFile(
  new URL('apps/host/rsbuild.config.ts', fixtureRoot),
  'utf8',
);
const bootstrapSource = await readFile(
  new URL('apps/host/src/bootstrap.tsx', fixtureRoot),
  'utf8',
);
for (const alias of dependencyAliases) {
  if (!hostConfig.includes(`${alias}: {`)) {
    throw new Error(`Host Module Federation remotes omit ${alias}.`);
  }
  const exposedName = alias === 'header' ? 'Header' : 'Hero';
  if (!bootstrapSource.includes(`from '${alias}/${exposedName}'`)) {
    throw new Error(`Host source does not import ${alias}/${exposedName}.`);
  }
}

for (const remote of [
  { name: 'header', exposed: './Header' },
  { name: 'hero', exposed: './Hero' },
]) {
  const remoteConfig = await readFile(
    new URL(`apps/${remote.name}/rsbuild.config.ts`, fixtureRoot),
    'utf8',
  );
  for (const requiredFragment of [
    "entry: {\n      index: './src/index.ts'",
    "filename: 'remoteEntry.js'",
    "assetPrefix: 'auto'",
    remote.exposed,
    'withZephyr()',
  ]) {
    if (!remoteConfig.includes(requiredFragment)) {
      throw new Error(`${remote.name} config is missing ${requiredFragment}`);
    }
  }
  if (
    remoteConfig.indexOf('pluginModuleFederation(') >
    remoteConfig.indexOf('withZephyr()')
  ) {
    throw new Error(`${remote.name} must apply withZephyr after federation.`);
  }
}

const selectorExamples = await readJson('dependency-selectors.json');
if (
  selectorExamples.sameProjectWorkspaceBuild.header !== 'workspace:*' ||
  selectorExamples.sameProjectProductionEnvironment.header !==
    'header@production' ||
  selectorExamples.crossProjectProductionEnvironment.header !==
    'header.design-system.acme@production'
) {
  throw new Error('Dependency selector examples drifted from the guide.');
}

for (const artifactPath of [
  'apps/header/dist/remoteEntry.js',
  'apps/header/dist/mf-manifest.json',
  'apps/hero/dist/remoteEntry.js',
  'apps/hero/dist/mf-manifest.json',
  'apps/host/dist/index.html',
]) {
  if (!existsSync(join(fixturePath, artifactPath))) {
    throw new Error(`Expected build artifact ${artifactPath}.`);
  }
}

for (const [remoteName, exposedModule] of [
  ['header', './Header'],
  ['hero', './Hero'],
]) {
  const manifest = await readJson(`apps/${remoteName}/dist/mf-manifest.json`);
  if (!JSON.stringify(manifest).includes(exposedModule)) {
    throw new Error(
      `${remoteName} manifest does not advertise ${exposedModule}.`,
    );
  }
}

function commandOutput(command, args) {
  const result = spawnSync(command, args, {
    cwd: fixtureRoot,
    encoding: 'utf8',
  });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed.\n${output}`);
  }
  return output;
}

const zephyrHelp = commandOutput('pnpm', ['exec', 'ze-cli', '--help']);
for (const requiredFlag of [
  'watch <directory>',
  '--target',
  'tap-app',
  '--metadata <path>',
]) {
  if (!zephyrHelp.includes(requiredFlag)) {
    throw new Error(`ze-cli help no longer includes ${requiredFlag}.`);
  }
}

const rsbuildHelp = commandOutput('pnpm', [
  '--filter',
  'header',
  'exec',
  'rsbuild',
  '--help',
]);
for (const requiredCommand of ['build', 'inspect']) {
  if (!rsbuildHelp.includes(requiredCommand)) {
    throw new Error(`Rsbuild help no longer includes ${requiredCommand}.`);
  }
}

console.log('Verified declared, locked, installed, and built fixture state.');
