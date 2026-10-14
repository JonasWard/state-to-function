export const VIEWS = ['edit', 'applet', 'help'] as const;
export type View = (typeof VIEWS)[number];

export interface ParsedHash {
  view: View | null;
  definition: string | null;
  applet: string | null;
  /** `qr` links carry QR_BASE strings and are rewritten to the canonical base64url form on load */
  encoding: 'base64url' | 'qr';
}

/** Path segment of QR links: `<base>Q/<definition>[/<applet>]`. */
const QR_TOKEN = 'Q';

const isView = (s: string): s is View => (VIEWS as readonly string[]).includes(s);

/**
 * `#/<view>/<definition>[/<applet>]`. Links from before the densing switch look like `#<definition>[/<applet>]`
 * (optionally with a leading slash) and open the applet when they carry applet values.
 */
export const parseHash = (hash: string): ParsedHash => {
  const [first = '', second = '', third = ''] = hash.replace(/^#\/?/, '').split('/');
  if (isView(first)) return { view: first, definition: second || null, applet: third || null, encoding: 'base64url' };
  return { view: second ? 'applet' : null, definition: first || null, applet: second || null, encoding: 'base64url' };
};

export const formatHash = (view: View, definition: string, applet: string) =>
  `#/${view}/${definition}${applet ? `/${applet}` : ''}`;

/**
 * QR links put the state in the path instead of the hash (Pages serves the app for it via 404.html), so
 * nothing in them is outside the QR alphanumeric set. The base path is matched case-insensitively
 * because the QR form is all uppercase.
 */
export const parseLocation = (pathname: string, hash: string, base: string): ParsedHash => {
  const prefix = `${base}${QR_TOKEN}/`;
  if (!pathname.toUpperCase().startsWith(prefix.toUpperCase())) return parseHash(hash);
  const [definition = '', applet = ''] = pathname.slice(prefix.length).split('/');
  return { view: 'applet', definition: definition || null, applet: applet || null, encoding: 'qr' };
};

/** `Q/<definition>[/<applet>]` for QR_BASE-encoded strings, relative to the base path. */
export const formatQrPath = (definition: string, applet: string) =>
  `${QR_TOKEN}/${definition}${applet ? `/${applet}` : ''}`;

/** The whole QR link in uppercase, so a QR code stores it in alphanumeric mode (5.5 instead of 8 bits a character). */
export const formatQrUrl = (origin: string, base: string, definition: string, applet: string) =>
  `${origin}${base}${formatQrPath(definition, applet)}`.toUpperCase();
