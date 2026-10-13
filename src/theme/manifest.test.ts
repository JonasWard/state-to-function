import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { palette } from './palette';

const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));

describe('web manifest', () => {
  it('uses the header colour from the palette', () => {
    expect(manifest.theme_color).toBe(palette.accent200);
  });

  it('lists icons that exist', () => {
    for (const icon of manifest.icons) expect(existsSync(`public/${icon.src}`)).toBe(true);
  });
});
