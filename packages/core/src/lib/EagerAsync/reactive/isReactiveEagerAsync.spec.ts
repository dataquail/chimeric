import { makeEagerAsyncHookWithoutParamsReturnsString } from '../../__tests__/eagerAsyncFixtures';
import { createReactiveEagerAsync } from './createReactiveEagerAsync';
import { isReactiveEagerAsync } from './isReactiveEagerAsync';

describe('isReactiveEagerAsync', () => {
  it('should return false for unmarked function', () => {
    const mockReactiveEagerAsync = {
      use: makeEagerAsyncHookWithoutParamsReturnsString(),
    };

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(false);
  });

  it('should return true for marked function', () => {
    const mockReactiveEagerAsync = createReactiveEagerAsync(
      makeEagerAsyncHookWithoutParamsReturnsString(),
    );

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveEagerAsync('not an object')).toBe(false);
    expect(isReactiveEagerAsync(123)).toBe(false);
    expect(isReactiveEagerAsync(null)).toBe(false);
    expect(isReactiveEagerAsync(undefined)).toBe(false);
    expect(isReactiveEagerAsync({})).toBe(false);
    expect(isReactiveEagerAsync({ notUse: 'something' })).toBe(false);
    expect(isReactiveEagerAsync({ use: 'not a function' })).toBe(false);
  });
});
