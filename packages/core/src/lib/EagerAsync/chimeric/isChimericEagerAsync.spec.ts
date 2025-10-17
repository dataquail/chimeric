/* eslint-disable @typescript-eslint/no-explicit-any */
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import { isChimericEagerAsync } from './isChimericEagerAsync';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';

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
    const mockAsyncFn = () => Promise.resolve('test');
    expect(isChimericEagerAsync(mockAsyncFn as any)).toBe(false);

    // Object with use but not a function
    const mockReactiveEagerAsync = {
      use: 'not a function',
    };
    expect(isChimericEagerAsync(mockReactiveEagerAsync as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericEagerAsync(123 as any)).toBe(false);
    expect(isChimericEagerAsync(null as any)).toBe(false);
    expect(isChimericEagerAsync(undefined as any)).toBe(false);
    expect(isChimericEagerAsync({} as any)).toBe(false);
  });
});
