// Character sets for the text fields. They define the wire format: changing one needs a schema version bump.
const unique = (s: string) => [...new Set(s)];

export const SYMBOL_CHARS = unique('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzανβξΓγΔδΠπερζΣσςητΘΦφχλψμΩω?');
export const SUBSCRIPT_CHARS = unique('abcdefghijklmnopqrstuvwxyz0123456789-_.,αβγεφμ+()[]{}$*#~/<>!? ');
// superset of the url-safe-bitpacking name set so legacy names always convert
export const NAME_CHARS = unique("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789.-_()/,'%+:");
export const NUMBER_CHARS = unique('0123456789-.e');

export const MAX_TEXT_LENGTH = 31;

export const toChars = (s: string): string[] => [...s];
export const fromChars = (chars: readonly string[]): string => chars.join('');

export const invalidChars = (s: string, charset: readonly string[]): string[] =>
  unique([...s].filter((c) => !charset.includes(c)).join(''));

export const sanitize = (s: string, charset: readonly string[], max = MAX_TEXT_LENGTH): string =>
  [...s].filter((c) => charset.includes(c)).slice(0, max).join('');
