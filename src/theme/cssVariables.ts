import { fonts, palette } from './palette';

const kebab = (s: string) => s.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();

/** Exposes the palette as `--stf-*` custom properties for the CSS modules. */
export const applyCssVariables = (root: HTMLElement = document.documentElement) => {
  for (const [k, v] of Object.entries(palette)) root.style.setProperty(`--stf-${kebab(k)}`, v);
  for (const [k, v] of Object.entries(fonts)) root.style.setProperty(`--stf-font-${k}`, v);
  root.style.setProperty('--stf-content-max', '1200px');
  root.style.setProperty('--stf-hairline', `1px solid ${palette.line}`);
};
