import { describe, expect, it } from 'vitest';
import { formatHash, parseHash } from './hash';

describe('hash', () => {
  it('parses the current format', () => {
    expect(parseHash('#/edit/ARJQ')).toEqual({ view: 'edit', definition: 'ARJQ', applet: null });
    expect(parseHash('#/applet/ARJQ/BKO')).toEqual({ view: 'applet', definition: 'ARJQ', applet: 'BKO' });
    expect(parseHash('#/help')).toEqual({ view: 'help', definition: null, applet: null });
  });

  it('parses links from before the densing switch', () => {
    expect(parseHash('#ABJQ/BKO')).toEqual({ view: 'applet', definition: 'ABJQ', applet: 'BKO' });
    expect(parseHash('#/ABJQ/BKO')).toEqual({ view: 'applet', definition: 'ABJQ', applet: 'BKO' });
    expect(parseHash('#ABJQ')).toEqual({ view: null, definition: 'ABJQ', applet: null });
    expect(parseHash('#/ABJQ')).toEqual({ view: null, definition: 'ABJQ', applet: null });
  });

  it('parses empty hashes', () => {
    expect(parseHash('')).toEqual({ view: null, definition: null, applet: null });
    expect(parseHash('#/')).toEqual({ view: null, definition: null, applet: null });
  });

  it('formats and round-trips', () => {
    expect(formatHash('edit', 'ARJQ', '')).toBe('#/edit/ARJQ');
    const h = formatHash('applet', 'ARJQ', 'BKO');
    expect(h).toBe('#/applet/ARJQ/BKO');
    expect(parseHash(h)).toEqual({ view: 'applet', definition: 'ARJQ', applet: 'BKO' });
  });
});
