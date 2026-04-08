import { isChimericAllOptions } from './isChimericAllOptions';

describe('isChimericAllOptions', () => {
  it('returns true for object with only options key', () => {
    expect(isChimericAllOptions({ options: { enabled: false } })).toBe(true);
  });

  it('returns true for object with only nativeOptions key', () => {
    expect(isChimericAllOptions({ nativeOptions: { skip: true } })).toBe(true);
  });

  it('returns true for object with both options and nativeOptions keys', () => {
    expect(
      isChimericAllOptions({
        options: { enabled: false },
        nativeOptions: { skip: true },
      }),
    ).toBe(true);
  });

  it('returns false for object with domain keys', () => {
    expect(isChimericAllOptions({ name: 'John' })).toBe(false);
  });

  it('returns false for object with mixed keys', () => {
    expect(
      isChimericAllOptions({ options: { enabled: false }, name: 'John' }),
    ).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(isChimericAllOptions({})).toBe(false);
  });

  it('returns false for null', () => {
    expect(isChimericAllOptions(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isChimericAllOptions(undefined)).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isChimericAllOptions('string')).toBe(false);
    expect(isChimericAllOptions(42)).toBe(false);
    expect(isChimericAllOptions(true)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isChimericAllOptions([1, 2, 3])).toBe(false);
  });
});
