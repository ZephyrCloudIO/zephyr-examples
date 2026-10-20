import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const fixtureRoot = new URL('../', import.meta.url);
const headerDirectory = join(fixtureRoot.pathname, 'apps', 'header');
const headerSourcePath = join(headerDirectory, 'src', 'Header.tsx');
const rsbuildBinary = join(
  fixtureRoot.pathname,
  'node_modules',
  '.bin',
  'rsbuild',
);
const originalSource = await readFile(headerSourcePath, 'utf8');
const updatedSource = originalSource.replace(
  'Header fixture v1',
  'Header fixture watch verification',
);
let output = '';

const watcher = spawn(rsbuildBinary, ['build', '--watch'], {
  cwd: headerDirectory,
  env: {
    ...process.env,
    ZEPHYR_EXAMPLE_OFFLINE: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
watcher.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
watcher.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

async function waitForBuildCount(expectedCount) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const buildCount = output.match(/ready\s+built/g)?.length ?? 0;
    if (buildCount >= expectedCount) {
      return;
    }
    if (watcher.exitCode !== null) {
      throw new Error(`Rsbuild watch exited early.\n${output}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(
    `Timed out waiting for Rsbuild watch build ${expectedCount}.\n${output}`,
  );
}

try {
  await waitForBuildCount(1);
  await writeFile(headerSourcePath, updatedSource);
  await waitForBuildCount(2);
} finally {
  await writeFile(headerSourcePath, originalSource);
  watcher.kill('SIGINT');
  await Promise.race([
    new Promise((resolve) => watcher.once('close', resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (watcher.exitCode === null) {
    watcher.kill('SIGTERM');
  }
}

console.log('Verified rsbuild build --watch rebuilds web output.');
