import { fonts, palette, radius, rowHeight, space, symbolSize, type } from './palette';

const kebab = (s: string) => s.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();

/** Exposes the palette and scales as `--stf-*` custom properties for the CSS modules. */
export const applyCssVariables = (root: HTMLElement = document.documentElement) => {
  const set = (prefix: string, values: Record<string, string>) =>
    Object.entries(values).forEach(([k, v]) => root.style.setProperty(`--stf-${prefix}${kebab(k)}`, v));
  set('', palette);
  set('font-', fonts);
  set('text-', type);
  set('space-', space);
  set('symbol-', symbolSize);
  root.style.setProperty('--stf-radius', `${radius}px`);
  root.style.setProperty('--stf-row-height', rowHeight);
  root.style.setProperty('--stf-content-max', '1200px');
  root.style.setProperty('--stf-hairline', `1px solid ${palette.line}`);
};
