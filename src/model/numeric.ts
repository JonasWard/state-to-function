export const FLOAT_PRECISION = 0.01;
export const FLOAT_MIN = -5242.88;
export const FLOAT_MAX = 5242.87;
export const INT_MIN = -512;
export const INT_MAX = 511;
export const MAX_INPUTS = 31;
export const MAX_METHODS = 31;

const decimalsOf = (precision: number) => Math.max(0, Math.ceil(-Math.log10(precision)));

export const roundTo = (v: number, precision: number) =>
  Number((Math.round(v / precision) * precision).toFixed(decimalsOf(precision)));

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const normalizeRange = (min: number, max: number): [number, number] => (min <= max ? [min, max] : [max, min]);

export const toFloat = (v: number) => roundTo(clamp(Number.isFinite(v) ? v : 0, FLOAT_MIN, FLOAT_MAX), FLOAT_PRECISION);
export const toInt = (v: number) => clamp(Math.round(Number.isFinite(v) ? v : 0), INT_MIN, INT_MAX);

export const parseConstant = (s: string): number => (s.trim() === '' ? NaN : Number(s));

const grouped = new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 });

export const formatNumber = (n: number): string => {
  if (Number.isNaN(n)) return 'NaN';
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '−∞';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e12 || abs < 1e-6)) return n.toExponential(4).replace('-', '−');
  return grouped.format(n).replace(/,/g, ' ').replace('-', '−');
};
