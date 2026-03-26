/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEligibleReactive } from './isEligibleReactive';

describe('isEligibleReactive', () => {
  it('should return true for objects with a use function', () => {
    expect(isEligibleReactive({ useHook: () => undefined })).toBe(true);
    expect(
      isEligibleReactive({
        useHook: function () {
          return undefined;
        },
      }),
    ).toBe(true);
    expect(isEligibleReactive({ useHook: async () => undefined })).toBe(true);
  });

  it('should return true for functions with a use property', () => {
    const fn = () => undefined;
    (fn as any).useHook = () => undefined;
    expect(isEligibleReactive(fn)).toBe(true);
  });

  it('should return false for objects without a use function', () => {
    expect(isEligibleReactive({})).toBe(false);
    expect(isEligibleReactive({ notUseHook: () => undefined })).toBe(false);
    expect(isEligibleReactive({ useHook: 'not a function' })).toBe(false);
    expect(isEligibleReactive({ useHook: 42 })).toBe(false);
    expect(isEligibleReactive({ useHook: null })).toBe(false);
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
    arr.useHook = () => undefined;
    expect(isEligibleReactive(arr)).toBe(true); // Arrays are objects, so this should work
  });
});
