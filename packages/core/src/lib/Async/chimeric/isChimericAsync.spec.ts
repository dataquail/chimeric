/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncTestFixtures } from '../__tests__/asyncFixtures';
import { fuseChimericAsync } from './fuseChimericAsync';
import { isChimericAsync } from './isChimericAsync';

describe('isChimericAsync', () => {
  it('should return true for a chimeric async function', () => {
    const { idiomaticAsync: mockIdiomaticAsync } =
      AsyncTestFixtures.withoutParams.getIdiomatic();
    const { reactiveAsync: mockReactiveAsync } =
      AsyncTestFixtures.withoutParams.getReactive();
    const mockChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });

    expect(isChimericAsync(mockChimericAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericAsync('not a function' as any)).toBe(false);

    // Function without use
    const mockAsyncFn = () => Promise.resolve('test');
    expect(isChimericAsync(mockAsyncFn as any)).toBe(false);

    // Object with use but not a function
    const { fn: mockAsyncHookFn } =
      AsyncTestFixtures.withoutParams.getReactive();
    const mockReactiveAsync = {
      use: mockAsyncHookFn,
    };
    expect(isChimericAsync(mockReactiveAsync as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericAsync(123 as any)).toBe(false);
    expect(isChimericAsync(null as any)).toBe(false);
    expect(isChimericAsync(undefined as any)).toBe(false);
    expect(isChimericAsync({} as any)).toBe(false);
  });
});
