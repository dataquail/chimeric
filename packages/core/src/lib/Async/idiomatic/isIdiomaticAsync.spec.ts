import { makeIdiomaticAsyncWithoutParamsReturnsString } from '../__tests__/asyncFixtures';
import { isIdiomaticAsync } from './isIdiomaticAsync';

describe('isIdiomaticAsync', () => {
  it('should return true for a function', () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();

    expect(isIdiomaticAsync(mockIdiomaticAsync)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticAsync('not a function')).toBe(false);
    expect(isIdiomaticAsync(123)).toBe(false);
    expect(isIdiomaticAsync({})).toBe(false);
    expect(isIdiomaticAsync(null)).toBe(false);
    expect(isIdiomaticAsync(undefined)).toBe(false);
  });
});
