import { describe, expect, it } from 'vitest';
import { getRomanTimeString } from '../../src/services/romanTimeString';

describe('getRomanTimeString', () => {
  it('returns an empty string for 0', () => {
    expect(getRomanTimeString(0)).toBe('');
  });

  it('returns an empty string for negative input', () => {
    expect(getRomanTimeString(-5)).toBe('');
  });

  it.each([
    [1, 'I'],
    [2, 'II'],
    [3, 'III'],
    [5, 'V'],
    [10, 'X'],
    [50, 'L'],
    [100, 'C'],
    [500, 'D'],
    [1000, 'M'],
  ])('converts the base symbol %i to %s', (input, expected) => {
    expect(getRomanTimeString(input)).toBe(expected);
  });

  it.each([
    [4, 'IV'],
    [9, 'IX'],
    [40, 'XL'],
    [49, 'XLIX'],
    [90, 'XC'],
    [400, 'CD'],
    [900, 'CM'],
    [999, 'CMXCIX'],
  ])('uses subtractive notation for %i -> %s', (input, expected) => {
    expect(getRomanTimeString(input)).toBe(expected);
  });

  it.each([
    [14, 'XIV'],
    [38, 'XXXVIII'],
    [1994, 'MCMXCIV'],
    [2026, 'MMXXVI'],
    [3999, 'MMMCMXCIX'],
  ])('composes mixed values %i -> %s', (input, expected) => {
    expect(getRomanTimeString(input)).toBe(expected);
  });

  it('handles values above the classical 3999 limit by repeating M', () => {
    expect(getRomanTimeString(4000)).toBe('MMMM');
    expect(getRomanTimeString(5250)).toBe('MMMMMCCL');
  });

  it('truncates fractional input to the integer part', () => {
    expect(getRomanTimeString(3.9)).toBe('III');
  });

  it('covers the prestige range used by the ranking UI (level - 20)', () => {
    // Levels 21..40 map to prestige I..XX in RankingList.vue.
    const prestige = Array.from({ length: 20 }, (_, i) =>
      getRomanTimeString(i + 1)
    );
    expect(prestige).toEqual([
      'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
      'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    ]);
  });
});
