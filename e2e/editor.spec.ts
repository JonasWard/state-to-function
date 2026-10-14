import { expect, hash, test } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('region', { name: 'Inputs' })).toBeVisible();
});

test('edits are stored in the hash and can be undone and redone', async ({ page }) => {
  const before = await hash(page);
  const name = page.getByLabel('input l name');
  await name.fill('length A');
  await name.press('Enter');
  await expect.poll(() => hash(page)).not.toBe(before);
  const after = await hash(page);
  await page.locator('body').click({ position: { x: 5, y: 850 } });
  await page.keyboard.press('Control+z');
  await expect.poll(() => hash(page)).toBe(before);
  await page.keyboard.press('Control+y');
  await expect.poll(() => hash(page)).toBe(after);
});

test('a new method gets an unused symbol', async ({ page }) => {
  await page.getByRole('button', { name: 'Add method' }).click();
  await expect(page.getByRole('region', { name: 'Methods' }).getByRole('button', { name: /^Symbol B,/ })).toBeVisible();
});

test('changing the input type keeps the value', async ({ page }) => {
  const row = page.getByRole('region', { name: 'Inputs' });
  await row.getByLabel('Integer').first().click();
  await expect(page.getByLabel('input l default')).toHaveValue('100');
  await row.getByLabel('Constant').first().click();
  await expect(page.getByLabel('input l value')).toHaveValue('100');
});

test('removing a referenced input asks first and keeps the results', async ({ page }) => {
  const results = page.getByRole('region', { name: 'Methods' }).locator('output');
  const before = await results.allInnerTexts();
  await page.getByRole('button', { name: 'Remove input w' }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Inputs' }).getByRole('button', { name: /^Symbol w/ })).toHaveCount(0);
  expect(await results.allInnerTexts()).toEqual(before);
});

test('the symbol picker opens from the keyboard', async ({ page }) => {
  await page.getByRole('button', { name: /^Symbol l/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('group', { name: 'Symbol' })).toBeVisible();
});

test('controls have accessible names', async ({ page }) => {
  for (const name of ['Undo', 'Redo', 'Settings', 'Copy link', 'Add input', 'Add method'])
    await expect(page.getByRole('button', { name })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add term' }).first()).toBeVisible();
});

test('number fields group digits unless focused', async ({ page }) => {
  const max = page.getByLabel('input l max');
  await expect(max).toHaveValue('5 000');
  await max.focus();
  await expect(max).toHaveValue('5000');
  await max.fill('4000');
  await max.press('Enter');
  await page.locator('body').click({ position: { x: 5, y: 850 } });
  await expect(max).toHaveValue('4 000');
});

test('number fields clamp out-of-range values', async ({ page }) => {
  const max = page.getByLabel('input l max');
  await max.fill('99999');
  await max.press('Enter');
  await expect(max).toHaveValue('5242.87');
  const value = page.getByLabel('input l default');
  await value.fill('abc');
  await value.press('Enter');
  await expect(value).toHaveValue('100');
});
