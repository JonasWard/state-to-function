import { describe, expect, it } from 'vitest';
import { formatHash, formatQrUrl, parseHash, parseLocation } from './hash';

describe('hash', () => {
  it('parses the current format', () => {
    expect(parseHash('#/edit/ARJQ')).toEqual({ view: 'edit', definition: 'ARJQ', applet: null, encoding: 'base64url' });
    expect(parseHash('#/applet/ARJQ/BKO')).toEqual({ view: 'applet', definition: 'ARJQ', applet: 'BKO', encoding: 'base64url' });
    expect(parseHash('#/help')).toEqual({ view: 'help', definition: null, applet: null, encoding: 'base64url' });
  });

  it('parses links from before the densing switch', () => {
    expect(parseHash('#ABJQ/BKO')).toEqual({ view: 'applet', definition: 'ABJQ', applet: 'BKO', encoding: 'base64url' });
    expect(parseHash('#/ABJQ/BKO')).toEqual({ view: 'applet', definition: 'ABJQ', applet: 'BKO', encoding: 'base64url' });
    expect(parseHash('#ABJQ')).toEqual({ view: null, definition: 'ABJQ', applet: null, encoding: 'base64url' });
    expect(parseHash('#/ABJQ')).toEqual({ view: null, definition: 'ABJQ', applet: null, encoding: 'base64url' });
  });

  it('parses empty hashes', () => {
    expect(parseHash('')).toEqual({ view: null, definition: null, applet: null, encoding: 'base64url' });
    expect(parseHash('#/')).toEqual({ view: null, definition: null, applet: null, encoding: 'base64url' });
  });

  it('formats and round-trips', () => {
    expect(formatHash('edit', 'ARJQ', '')).toBe('#/edit/ARJQ');
    const h = formatHash('applet', 'ARJQ', 'BKO');
    expect(h).toBe('#/applet/ARJQ/BKO');
    expect(parseHash(h)).toEqual({ view: 'applet', definition: 'ARJQ', applet: 'BKO', encoding: 'base64url' });
  });

  it('formats QR links in uppercase', () => {
    const url = formatQrUrl('https://jonasward.github.io', '/state-to-function/', '0ABC', '1DE');
    expect(url).toBe('HTTPS://JONASWARD.GITHUB.IO/STATE-TO-FUNCTION/Q/0ABC/1DE');
    expect(url).toMatch(/^[0-9A-Z $%*+\-./:]+$/);
    expect(formatQrUrl('http://localhost:4173', '/state-to-function/', '0ABC', '')).toBe(
      'HTTP://LOCALHOST:4173/STATE-TO-FUNCTION/Q/0ABC'
    );
  });

  it('reads QR links from the path, case-insensitively', () => {
    const base = '/state-to-function/';
    const qr = { view: 'applet', definition: '0ABC', applet: '1DE', encoding: 'qr' };
    expect(parseLocation('/STATE-TO-FUNCTION/Q/0ABC/1DE', '', base)).toEqual(qr);
    expect(parseLocation('/state-to-function/Q/0ABC/1DE', '', base)).toEqual(qr);
    expect(parseLocation('/state-to-function/Q/0ABC', '', base)).toEqual({ ...qr, applet: null });
    expect(parseLocation(base, '#/edit/ARJQ', base)).toEqual(parseHash('#/edit/ARJQ'));
    expect(parseLocation(base, '#/Q/0ABC', base).encoding).toBe('base64url');
  });
});
