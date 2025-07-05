/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { makeAsyncHookWithoutParamsReturnsString } from '../__tests__/asyncFixtures';
import { isChimericAsync } from './isChimericAsync';

describe('isChimericAsync', () => {
  it('should return true for a chimeric async function', () => {
    const mockChimericAsync = makeAsyncFnWithoutParamsReturnsString() as any;
    mockChimericAsync.use = makeAsyncHookWithoutParamsReturnsString();

    expect(isChimericAsync(mockChimericAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericAsync('not a function')).toBe(false);

    // Function without use
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isChimericAsync(mockAsyncFn)).toBe(false);

    // Object with use but not a function
    const mockReactiveAsync = {
      use: makeAsyncHookWithoutParamsReturnsString(),
    };
    expect(isChimericAsync(mockReactiveAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericAsync(123)).toBe(false);
    expect(isChimericAsync(null)).toBe(false);
    expect(isChimericAsync(undefined)).toBe(false);
    expect(isChimericAsync({})).toBe(false);
  });
});
