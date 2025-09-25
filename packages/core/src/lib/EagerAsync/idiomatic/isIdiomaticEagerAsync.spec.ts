import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { createIdiomaticEagerAsync } from './createIdiomaticEagerAsync';
import { isIdiomaticEagerAsync } from './isIdiomaticEagerAsync';

describe('isIdiomaticEagerAsync', () => {
  it('should return false for unmarked function', () => {
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();

    expect(isIdiomaticEagerAsync(mockAsyncFn)).toBe(false);
  });

  it('should return true for marked function', () => {
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isIdiomaticEagerAsync(createIdiomaticEagerAsync(mockAsyncFn))).toBe(
      true,
    );
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticEagerAsync('not a function')).toBe(false);
    expect(isIdiomaticEagerAsync(123)).toBe(false);
    expect(isIdiomaticEagerAsync({})).toBe(false);
    expect(isIdiomaticEagerAsync(null)).toBe(false);
    expect(isIdiomaticEagerAsync(undefined)).toBe(false);
  });
});
