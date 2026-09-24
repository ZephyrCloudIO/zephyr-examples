import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

const headerSourcePath = fileURLToPath(
  new URL('../apps/header/src/Header.tsx', import.meta.url),
);

test('loads both remotes and observes a subsequent header update', async ({
  page,
  request,
}) => {
  const browserErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      !message.text().toLowerCase().includes('favicon')
    ) {
      browserErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('requestfailed', (requestEvent) => {
    failedRequests.push(
      `${requestEvent.method()} ${requestEvent.url()} ${
        requestEvent.failure()?.errorText ?? 'unknown failure'
      }`,
    );
  });

  for (const [port, exposedModule] of [
    [3001, './Header'],
    [3002, './Hero'],
  ] as const) {
    const remoteEntry = await request.get(
      `http://127.0.0.1:${port}/remoteEntry.js`,
    );
    expect(remoteEntry.ok()).toBeTruthy();

    const manifestResponse = await request.get(
      `http://127.0.0.1:${port}/mf-manifest.json`,
    );
    expect(manifestResponse.ok()).toBeTruthy();
    expect(JSON.stringify(await manifestResponse.json())).toContain(
      exposedModule,
    );
  }

  await page.goto('/');
  await expect(page.getByTestId('header')).toHaveText('Header fixture v1');
  await expect(page.getByTestId('hero')).toContainText('Hero fixture');

  const originalHeaderSource = await readFile(headerSourcePath, 'utf8');
  const updatedHeaderSource = originalHeaderSource.replace(
    'Header fixture v1',
    'Header fixture v2',
  );

  try {
    await writeFile(headerSourcePath, updatedHeaderSource);
    await expect(async () => {
      await page.reload({ waitUntil: 'networkidle' });
      await expect(page.getByTestId('header')).toHaveText('Header fixture v2');
    }).toPass({ timeout: 30_000 });
  } finally {
    await writeFile(headerSourcePath, originalHeaderSource);
  }

  expect(browserErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});
