import { isEligibleIdiomatic } from './isEligibleIdiomatic';

describe('isEligibleIdiomatic', () => {
  it('should return true for functions', () => {
    expect(isEligibleIdiomatic(() => undefined)).toBe(true);
    expect(
      isEligibleIdiomatic(function () {
        return undefined;
      }),
    ).toBe(true);
    expect(isEligibleIdiomatic(async () => undefined)).toBe(true);
    expect(
      isEligibleIdiomatic(function* () {
        yield undefined;
      }),
    ).toBe(true);
  });

  it('should return false for non-functions', () => {
    expect(isEligibleIdiomatic({})).toBe(false);
    expect(isEligibleIdiomatic([])).toBe(false);
    expect(isEligibleIdiomatic('string')).toBe(false);
    expect(isEligibleIdiomatic(42)).toBe(false);
    expect(isEligibleIdiomatic(true)).toBe(false);
    expect(isEligibleIdiomatic(null)).toBe(false);
    expect(isEligibleIdiomatic(undefined)).toBe(false);
  });

  it('should return false for objects with function-like properties', () => {
    const obj = {
      call: () => undefined,
      apply: () => undefined,
    };
    expect(isEligibleIdiomatic(obj)).toBe(false);
  });
});
