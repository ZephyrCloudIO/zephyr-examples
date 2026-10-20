import { existsSync } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const fixtureRoot = new URL('../', import.meta.url);
const logDirectory = join(fixtureRoot.pathname, '.mf');
const logPath = join(logDirectory, 'typesGenerate.log');

await rm(logDirectory, { recursive: true, force: true });

const result = spawnSync('pnpm', ['run', 'reproduce:type-001'], {
  cwd: fixtureRoot,
  encoding: 'utf8',
});
const combinedOutput = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;

if (!combinedOutput.includes('TYPE-001')) {
  throw new Error(`Expected TYPE-001 in build output.\n${combinedOutput}`);
}

const reproductionCommand = combinedOutput.match(
  /args: \{"cmd":"([^"]+)"\}/,
)?.[1];
if (!reproductionCommand) {
  throw new Error(
    `TYPE-001 did not include its generated reproduction command.\n${combinedOutput}`,
  );
}

const reproductionParts = reproductionCommand.split(' ');
const projectFlagIndex = reproductionParts.indexOf('--project');
if (projectFlagIndex < 2 || !reproductionParts[projectFlagIndex + 1]) {
  throw new Error(`Could not parse TYPE-001 command: ${reproductionCommand}`);
}

const reproductionResult = spawnSync(
  reproductionParts[0],
  reproductionParts.slice(1),
  {
    cwd: fixtureRoot,
    encoding: 'utf8',
  },
);
const reproductionOutput = `${reproductionResult.stdout ?? ''}\n${
  reproductionResult.stderr ?? ''
}`;
if (reproductionResult.status === 0 || !reproductionOutput.includes('TS6059')) {
  throw new Error(
    `Expected the generated TYPE-001 command to reproduce TS6059.\n${reproductionOutput}`,
  );
}

const rsbuildBinary = join(
  fixtureRoot.pathname,
  'node_modules',
  '.bin',
  'rsbuild',
);
const devServer = spawn(
  rsbuildBinary,
  [
    'dev',
    '--root',
    'diagnostics/type-001',
    '--config',
    'rsbuild.config.ts',
    '--host',
    '127.0.0.1',
    '--port',
    '3101',
    '--strict-port',
  ],
  {
    cwd: fixtureRoot,
    env: {
      ...process.env,
      FEDERATION_DEBUG: 'true',
    },
    stdio: 'ignore',
  },
);

const logDeadline = Date.now() + 20_000;
while (Date.now() < logDeadline) {
  if (
    existsSync(logPath) &&
    (await readFile(logPath, 'utf8')).includes('forkDevWorker')
  ) {
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
}

devServer.kill('SIGINT');
await Promise.race([
  new Promise((resolve) => devServer.once('close', resolve)),
  new Promise((resolve) => setTimeout(resolve, 5_000)),
]);
if (devServer.exitCode === null) {
  devServer.kill('SIGTERM');
}

if (!existsSync(logPath)) {
  throw new Error(`Expected Module Federation debug log at ${logPath}.`);
}
const debugLog = await readFile(logPath, 'utf8');
if (!debugLog.includes('forkDevWorker')) {
  throw new Error('Expected dev-worker evidence in .mf/typesGenerate.log.');
}

console.log('Verified reproducible TYPE-001/TS6059 diagnostics.');
