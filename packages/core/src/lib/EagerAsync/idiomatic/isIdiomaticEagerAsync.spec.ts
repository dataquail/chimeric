import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isIdiomaticEagerAsync } from './isIdiomaticEagerAsync';

describe('isIdiomaticEagerAsync', () => {
  it('should return true for a function', () => {
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();

    expect(isIdiomaticEagerAsync(mockAsyncFn)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticEagerAsync('not a function')).toBe(false);
    expect(isIdiomaticEagerAsync(123)).toBe(false);
    expect(isIdiomaticEagerAsync({})).toBe(false);
    expect(isIdiomaticEagerAsync(null)).toBe(false);
    expect(isIdiomaticEagerAsync(undefined)).toBe(false);
  });
});
