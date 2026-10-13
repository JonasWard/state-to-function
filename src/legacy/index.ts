export type { LegacyResult } from './legacyDecoder';

/** Decodes a url-safe-bitpacking link; the old library is only downloaded when this is called. */
export const upgradeLegacy = async (definition: string, applet?: string) =>
  (await import('./legacyDecoder')).decodeLegacy(definition, applet);
