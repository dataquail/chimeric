/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeEagerAsyncHookWithoutParamsReturnsString } from '../../__tests__/eagerAsyncFixtures';
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isChimericEagerAsync } from './isChimericEagerAsync';

describe('isChimericEagerAsync', () => {
  it('should return true for a chimeric eager async function', () => {
    const mockChimericEagerAsync =
      makeAsyncFnWithoutParamsReturnsString() as any;
    mockChimericEagerAsync.useEagerAsync =
      makeEagerAsyncHookWithoutParamsReturnsString();

    expect(isChimericEagerAsync(mockChimericEagerAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericEagerAsync('not a function')).toBe(false);

    // Function without useEagerAsync
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isChimericEagerAsync(mockAsyncFn)).toBe(false);

    // Object with useEagerAsync but not a function
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithoutParamsReturnsString(),
    };
    expect(isChimericEagerAsync(mockReactiveEagerAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericEagerAsync(123)).toBe(false);
    expect(isChimericEagerAsync(null)).toBe(false);
    expect(isChimericEagerAsync(undefined)).toBe(false);
    expect(isChimericEagerAsync({})).toBe(false);
  });
});
