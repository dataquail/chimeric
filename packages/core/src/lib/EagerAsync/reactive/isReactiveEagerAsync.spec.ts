import {
  makeEagerAsyncHookWithoutParamsReturnsString,
  makeReactiveEagerAsyncWithoutParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';
import { isReactiveEagerAsync } from './isReactiveEagerAsync';

describe('isReactiveEagerAsync', () => {
  it('should return true for an object with useEagerAsync function', () => {
    const mockReactiveEagerAsync = {
      use: makeEagerAsyncHookWithoutParamsReturnsString(),
    };

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return true for a function with use property', () => {
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithoutParamsReturnsString();

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
