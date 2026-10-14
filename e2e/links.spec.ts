import { encodeApplet } from '../src/model/appletSchema';
import { encodeDefinition, QR_BASE } from '../src/model/codec';
import { DEFAULT_DEFINITION } from '../src/model/defaults';
import { formatHash, formatQrPath } from '../src/state/hash';
import { expect, hash, OLD_APPLET_W250, OLD_DEFINITION, test, toasts } from './fixtures';

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
  await expect(toasts(page)).toContainText('upgraded');
  await expect.poll(() => hash(page)).toBe(canonical);
});

test('an old applet link keeps its values', async ({ page }) => {
  await page.goto(`./#${OLD_DEFINITION}/${OLD_APPLET_W250}`);
  await expect.poll(() => hash(page)).toMatch(/^#\/applet\/[^/]+\/[^/]+$/);
  await expect(page.getByRole('textbox', { name: 'w', exact: true })).toHaveValue('250');
});

test('an unreadable link falls back to the example with a warning', async ({ page }) => {
  await page.goto('./#/edit/garbage');
  await expect(toasts(page)).toContainText('could not be read');
  await expect(toasts(page)).toHaveText('', { timeout: 6000 });
  await expect(page.getByLabel('method V result')).toContainText('1 000 000');
});

test('a QR link opens the same state and is rewritten to the canonical link', async ({ page }) => {
  const overrides = [null, 250, null];
  // like the host's rewrite rule, vite preview serves the app for the uppercase QR path
  await page.goto(`./${formatQrPath(encodeDefinition(DEFAULT_DEFINITION, QR_BASE), encodeApplet(DEFAULT_DEFINITION, overrides, QR_BASE))}`);
  await expect(page.getByRole('textbox', { name: 'w', exact: true })).toHaveValue('250');
  await expect.poll(() => page.evaluate(() => location.pathname)).toBe('/');
  await expect
    .poll(() => hash(page))
    .toBe(formatHash('applet', encodeDefinition(DEFAULT_DEFINITION), encodeApplet(DEFAULT_DEFINITION, overrides)));
  await expect(toasts(page)).toHaveText('');
});
