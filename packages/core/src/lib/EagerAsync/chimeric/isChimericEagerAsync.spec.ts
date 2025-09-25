import { makeEagerAsyncHookWithoutParamsReturnsString } from '../../__tests__/eagerAsyncFixtures';
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isChimericEagerAsync } from './isChimericEagerAsync';
import { createIdiomaticEagerAsync } from '../idiomatic/createIdiomaticEagerAsync';
import { createReactiveEagerAsync } from '../reactive/createReactiveEagerAsync';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';

describe('isChimericEagerAsync', () => {
  it('should return true for a chimeric eager async function', () => {
    const mockIdiomaticEagerAsync = createIdiomaticEagerAsync(
      makeAsyncFnWithoutParamsReturnsString(),
    );
    const mockReactiveEagerAsync = createReactiveEagerAsync(
      makeEagerAsyncHookWithoutParamsReturnsString(),
    );

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });

    expect(isChimericEagerAsync(chimericEagerAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericEagerAsync('not a function')).toBe(false);

    // Function without use
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isChimericEagerAsync(mockAsyncFn)).toBe(false);

    // Object with use but not a function
    const mockReactiveEagerAsync = {
      use: makeEagerAsyncHookWithoutParamsReturnsString(),
    };
    expect(isChimericEagerAsync(mockReactiveEagerAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericEagerAsync(123)).toBe(false);
    expect(isChimericEagerAsync(null)).toBe(false);
    expect(isChimericEagerAsync(undefined)).toBe(false);
    expect(isChimericEagerAsync({})).toBe(false);
  });
});
