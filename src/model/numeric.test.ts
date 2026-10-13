import { describe, expect, it } from 'vitest';
import { formatNumber, groupDigits } from './numeric';

describe('number formatting', () => {
  it('groups integer digits only', () => {
    expect(groupDigits('5000')).toBe('5\u202F000');
    expect(groupDigits('-1234.5')).toBe('-1\u202F234.5');
    expect(groupDigits('100')).toBe('100');
    expect(groupDigits('0.12345')).toBe('0.12345');
  });

  it('formats results', () => {
    expect(formatNumber(10000)).toBe('10\u202F000');
    expect(formatNumber(-1234.5)).toBe('−1\u202F234.5');
    expect(formatNumber(NaN)).toBe('NaN');
    expect(formatNumber(Infinity)).toBe('∞');
  });
});
