import { expect, hash, OLD_APPLET_W250, OLD_DEFINITION, test } from './fixtures';

test('the root opens the example in canonical form without 404s', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  await page.goto('./');
  await expect.poll(() => hash(page)).toMatch(/^#\/edit\/A/);
  await expect(page.getByLabel('method V result')).toContainText('1 000 000');
  expect(failed).toEqual([]);
});

test('an old definition link is upgraded', async ({ page }) => {
  await page.goto('./');
  const canonical = await hash(page);
  await page.goto(`./#${OLD_DEFINITION}`);
  await expect(page.locator('.ant-message')).toContainText('upgraded');
  await expect.poll(() => hash(page)).toBe(canonical);
});

test('an old applet link keeps its values', async ({ page }) => {
  await page.goto(`./#${OLD_DEFINITION}/${OLD_APPLET_W250}`);
  await expect.poll(() => hash(page)).toMatch(/^#\/applet\/[^/]+\/[^/]+$/);
  await expect(page.getByRole('spinbutton', { name: 'w', exact: true })).toHaveValue('250');
});

test('an unreadable link falls back to the example with a warning', async ({ page }) => {
  await page.goto('./#/edit/garbage');
  await expect(page.locator('.ant-message')).toContainText('could not be read');
  await expect(page.getByLabel('method V result')).toContainText('1 000 000');
});
