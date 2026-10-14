import { describe, expect, it } from 'vitest';
import { formatHash, formatQrPath, parseHash } from './hash';

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

  it('parses and formats QR links', () => {
    expect(formatQrPath('0ABC', '1DE')).toBe('/Q/0ABC/1DE');
    expect(formatQrPath('0ABC', '')).toBe('/Q/0ABC');
    expect(parseHash('#/Q/0ABC/1DE')).toEqual({ view: 'applet', definition: '0ABC', applet: '1DE', encoding: 'qr' });
    expect(parseHash('#/Q/0ABC')).toEqual({ view: 'applet', definition: '0ABC', applet: null, encoding: 'qr' });
  });
});
