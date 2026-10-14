import { readFileSync, statSync } from 'node:fs';
import { expect, hash, openTab, test } from './fixtures';

const firstResult = (page: import('@playwright/test').Page) => page.getByLabel('A sub t result');

test('an applet value of 0 is used', async ({ page }) => {
  await page.goto('./');
  const min = page.getByLabel('input w min');
  await min.fill('0');
  await min.press('Enter');
  await openTab(page, 'Applet');
  const w = page.getByRole('spinbutton', { name: 'w', exact: true });
  await w.fill('0');
  await w.press('Enter');
  await expect(firstResult(page)).toHaveText('0');
});

test('exports use the current values and work offline', async ({ page, context }) => {
  const external: string[] = [];
  await context.route('**/*', (r) =>
    r.request().url().startsWith('http://localhost') ? r.continue() : (external.push(r.request().url()), r.abort())
  );
  await page.goto('./');
  await openTab(page, 'Applet');
  const w = page.getByRole('spinbutton', { name: 'w', exact: true });
  await w.fill('250');
  await w.press('Enter');
  await expect(firstResult(page)).toHaveText('25 000');

  const [csv] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'CSV' }).click()]);
  const text = readFileSync(await csv.path(), 'utf8');
  expect(text.startsWith('﻿')).toBe(true);
  expect(text).toContain('w,250,width');

  const [pdf] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'PDF' }).click()]);
  expect(statSync(await pdf.path()).size).toBeGreaterThan(5000);
  expect(external).toEqual([]);
});

test('back and forward move between pages and keep applet values', async ({ page }) => {
  await page.goto('./');
  await openTab(page, 'Applet');
  const w = page.getByRole('spinbutton', { name: 'w', exact: true });
  await w.fill('250');
  await w.press('Enter');
  await expect.poll(() => hash(page)).toMatch(/^#\/applet\/[^/]+\/[^/]+$/);
  const appletHash = await hash(page);
  await openTab(page, 'Definitions');
  await expect.poll(() => hash(page)).toMatch(/^#\/edit\/[^/]+\/[^/]+$/);
  const editHash = await hash(page);
  await page.goBack();
  await expect.poll(() => hash(page)).toBe(appletHash);
  await expect(page.getByRole('button', { name: 'PDF' })).toBeVisible();
  await page.goForward();
  await expect.poll(() => hash(page)).toBe(editHash);
  await expect(page.getByRole('button', { name: 'Add input' })).toBeVisible();
});

test('settings survive a reload', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('switch', { name: 'Compact definition rows' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('switch', { name: 'Compact definition rows' })).toBeChecked();
  await expect(page.getByLabel('input l name')).toBeHidden();
});
