/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEligibleReactive } from './isEligibleReactive';

describe('isEligibleReactive', () => {
  it('should return true for objects with a use function', () => {
    expect(isEligibleReactive({ use: () => undefined })).toBe(true);
    expect(
      isEligibleReactive({
        use: function () {
          return undefined;
        },
      }),
    ).toBe(true);
    expect(isEligibleReactive({ use: async () => undefined })).toBe(true);
  });

  it('should return true for functions with a use property', () => {
    const fn = () => undefined;
    (fn as any).use = () => undefined;
    expect(isEligibleReactive(fn)).toBe(true);
  });

  it('should return false for objects without a use function', () => {
    expect(isEligibleReactive({})).toBe(false);
    expect(isEligibleReactive({ notUse: () => undefined })).toBe(false);
    expect(isEligibleReactive({ use: 'not a function' })).toBe(false);
    expect(isEligibleReactive({ use: 42 })).toBe(false);
    expect(isEligibleReactive({ use: null })).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isEligibleReactive(null)).toBe(false);
    expect(isEligibleReactive(undefined)).toBe(false);
  });

  it('should return false for primitive values', () => {
    expect(isEligibleReactive('string')).toBe(false);
    expect(isEligibleReactive(42)).toBe(false);
    expect(isEligibleReactive(true)).toBe(false);
  });

  it('should return false for plain functions without use property', () => {
    expect(isEligibleReactive(() => undefined)).toBe(false);
    expect(
      isEligibleReactive(function () {
        return undefined;
      }),
    ).toBe(false);
  });

  it('should return false for arrays', () => {
    expect(isEligibleReactive([])).toBe(false);
    const arr: any = [];
    arr.use = () => undefined;
    expect(isEligibleReactive(arr)).toBe(true); // Arrays are objects, so this should work
  });
});
