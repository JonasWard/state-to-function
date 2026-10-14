export const VIEWS = ['edit', 'applet', 'help'] as const;
export type View = (typeof VIEWS)[number];

export interface ParsedHash {
  view: View | null;
  definition: string | null;
  applet: string | null;
  /** `qr` links carry QR_BASE strings and are rewritten to the canonical base64url form on load */
  encoding: 'base64url' | 'qr';
}

/** Marks a link made for QR codes; uppercase so the whole hash stays in the QR alphanumeric set. */
const QR_TOKEN = 'Q';

const isView = (s: string): s is View => (VIEWS as readonly string[]).includes(s);

/**
 * `#/<view>/<definition>[/<applet>]`. Links from before the densing switch look like `#<definition>[/<applet>]`
 * (optionally with a leading slash) and open the applet when they carry applet values.
 */
export const parseHash = (hash: string): ParsedHash => {
  const [first = '', second = '', third = ''] = hash.replace(/^#\/?/, '').split('/');
  if (first === QR_TOKEN) return { view: 'applet', definition: second || null, applet: third || null, encoding: 'qr' };
  if (isView(first)) return { view: first, definition: second || null, applet: third || null, encoding: 'base64url' };
  return { view: second ? 'applet' : null, definition: first || null, applet: second || null, encoding: 'base64url' };
};

export const formatHash = (view: View, definition: string, applet: string) =>
  `#/${view}/${definition}${applet ? `/${applet}` : ''}`;

/** The part after `#` of a QR link, for QR_BASE-encoded strings. */
export const formatQrPath = (definition: string, applet: string) =>
  `/${QR_TOKEN}/${definition}${applet ? `/${applet}` : ''}`;
