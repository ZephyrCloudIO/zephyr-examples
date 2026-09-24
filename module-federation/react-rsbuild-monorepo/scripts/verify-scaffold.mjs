import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const fixtureRoot = new URL('../', import.meta.url);
const scratchDirectory = await mkdtemp(
  join(tmpdir(), 'zephyr-rsbuild-scaffold-'),
);

function run(scriptName, args) {
  const result = spawnSync(
    'bash',
    [new URL(scriptName, fixtureRoot).pathname, ...args],
    {
      encoding: 'utf8',
      stdio: 'pipe',
    },
  );

  if (result.status !== 0) {
    throw new Error([result.stdout, result.stderr].filter(Boolean).join('\n'));
  }
}

try {
  run('scripts/scaffold-new.sh', [scratchDirectory]);
  run('scripts/add-existing-dependencies.sh', [join(scratchDirectory, 'host')]);

  for (const applicationName of ['host', 'header', 'hero']) {
    const packageJson = JSON.parse(
      await readFile(
        join(scratchDirectory, applicationName, 'package.json'),
        'utf8',
      ),
    );
    if (packageJson.name !== applicationName) {
      throw new Error(
        `Expected scaffolded ${applicationName} package name, received ${packageJson.name}`,
      );
    }
  }

  const hostPackage = JSON.parse(
    await readFile(join(scratchDirectory, 'host', 'package.json'), 'utf8'),
  );
  const expectedPins = {
    '@module-federation/rsbuild-plugin': '2.8.0',
    '@rsbuild/core': '2.1.8',
    '@rsbuild/plugin-react': '2.1.0',
    'zephyr-agent': '1.2.0',
    'zephyr-rsbuild-plugin': '1.2.0',
  };

  for (const [packageName, expectedVersion] of Object.entries(expectedPins)) {
    if (hostPackage.devDependencies?.[packageName] !== expectedVersion) {
      throw new Error(
        `Expected ${packageName}@${expectedVersion} in scaffolded host`,
      );
    }
  }

  console.log('Verified create-rsbuild and pnpm add commands.');
} finally {
  await rm(scratchDirectory, { recursive: true, force: true });
}
