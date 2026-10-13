export const VIEWS = ['edit', 'applet', 'help'] as const;
export type View = (typeof VIEWS)[number];

export interface ParsedHash {
  view: View | null;
  definition: string | null;
  applet: string | null;
}

const isView = (s: string): s is View => (VIEWS as readonly string[]).includes(s);

/**
 * `#/<view>/<definition>[/<applet>]`. Links from before the densing switch look like `#<definition>[/<applet>]`
 * (optionally with a leading slash) and open the applet when they carry applet values.
 */
export const parseHash = (hash: string): ParsedHash => {
  const [first = '', second = '', third = ''] = hash.replace(/^#\/?/, '').split('/');
  if (isView(first)) return { view: first, definition: second || null, applet: third || null };
  return { view: second ? 'applet' : null, definition: first || null, applet: second || null };
};

export const formatHash = (view: View, definition: string, applet: string) =>
  `#/${view}/${definition}${applet ? `/${applet}` : ''}`;
