import { expect, Page, test as base } from '@playwright/test';

/** Fails the test on page errors and React/console errors. */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        // react-pdf logs this harmless warning while rendering
        if (m.type() === 'error' || (m.type() === 'warning' && !m.text().includes('Buffer is not defined'))) errors.push(m.text());
      });
      await use(errors);
      expect(errors).toEqual([]);
    },
    { auto: true }
  ]
});

export { expect };

export const hash = (page: Page) => page.evaluate(() => location.hash);

/** The header tabs are a radio group. */
export const openTab = (page: Page, name: 'Help' | 'Definitions' | 'Applet' | 'Inputs' | 'Methods') =>
  page.getByRole('radiogroup', { name: 'Page' }).getByRole('radio', { name, exact: true }).click();

/** The toast live region. */
export const toasts = (page: Page) => page.getByRole('status', { name: 'Notifications' });

/** url-safe-bitpacking links made before the densing switch: the default example, and its applet with w = 250. */
export const OLD_DEFINITION =
  'ABJQGhtgneloAfSCcQ-hIGACw2uxYUAPpBOIfQkCEBrYYInoaAH0gnEPoSAoAKaKaE9GnqwCECEAEVVs9FYujT1YBCFEACkl52JLRp6sAhAiAAVK1bQno09WARgwIMICRUBnprpaFSICI';
export const OLD_APPLET_W250 = 'BKOBftASjg';
