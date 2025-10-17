/* eslint-disable @typescript-eslint/no-explicit-any */
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import { createReactiveEagerAsync } from './createReactiveEagerAsync';
import { isReactiveEagerAsync } from './isReactiveEagerAsync';

describe('isReactiveEagerAsync', () => {
  it('should return false for unmarked function', () => {
    const mockReactiveEagerAsync = {
      use: EagerAsyncTestFixtures.withoutParams.getReactive().fn,
    };

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(false);
  });

  it('should return true for marked function', () => {
    const mockReactiveEagerAsync = createReactiveEagerAsync(
      EagerAsyncTestFixtures.withoutParams.getReactive().fn,
    );

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveEagerAsync('not an object' as any)).toBe(false);
    expect(isReactiveEagerAsync(123 as any)).toBe(false);
    expect(isReactiveEagerAsync(null as any)).toBe(false);
    expect(isReactiveEagerAsync(undefined as any)).toBe(false);
    expect(isReactiveEagerAsync({} as any)).toBe(false);
    expect(isReactiveEagerAsync({ notUse: 'something' } as any)).toBe(false);
    expect(isReactiveEagerAsync({ use: 'not a function' } as any)).toBe(false);
  });
});
