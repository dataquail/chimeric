/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeEagerAsyncHookWithoutParamsReturnsString } from '../../__tests__/eagerAsyncFixtures';
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isChimericEagerAsync } from './isChimericEagerAsync';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';

describe('isChimericEagerAsync', () => {
  it('should return true for a chimeric eager async function', () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });

    expect(isChimericEagerAsync(chimericEagerAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericEagerAsync('not a function' as any)).toBe(false);

    // Function without use
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isChimericEagerAsync(mockAsyncFn as any)).toBe(false);

    // Object with use but not a function
    const mockReactiveEagerAsync = {
      use: makeEagerAsyncHookWithoutParamsReturnsString(),
    };
    expect(isChimericEagerAsync(mockReactiveEagerAsync as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericEagerAsync(123 as any)).toBe(false);
    expect(isChimericEagerAsync(null as any)).toBe(false);
    expect(isChimericEagerAsync(undefined as any)).toBe(false);
    expect(isChimericEagerAsync({} as any)).toBe(false);
  });
});
