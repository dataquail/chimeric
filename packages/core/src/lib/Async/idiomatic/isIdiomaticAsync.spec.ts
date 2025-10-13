/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncTestFixtures } from '../__tests__/asyncFixtures';
import { isIdiomaticAsync } from './isIdiomaticAsync';

describe('isIdiomaticAsync', () => {
  it('should return true for a function', () => {
    const { idiomaticAsync: mockIdiomaticAsync } = AsyncTestFixtures.withoutParams.getIdiomatic();

    expect(isIdiomaticAsync(mockIdiomaticAsync)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticAsync('not a function' as any)).toBe(false);
    expect(isIdiomaticAsync(123 as any)).toBe(false);
    expect(isIdiomaticAsync({} as any)).toBe(false);
    expect(isIdiomaticAsync(null as any)).toBe(false);
    expect(isIdiomaticAsync(undefined as any)).toBe(false);
  });
});
