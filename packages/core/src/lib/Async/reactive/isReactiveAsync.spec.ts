/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { makeAsyncHookWithoutParamsReturnsString } from '../__tests__/asyncFixtures';
import { isReactiveAsync } from './isReactiveAsync';

describe('isReactiveAsync', () => {
  it('should return true for an object with useAsync function', () => {
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithoutParamsReturnsString(),
    };

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return true for a function with useAsync property', () => {
    const mockReactiveAsync = makeAsyncFnWithoutParamsReturnsString() as any;
    mockReactiveAsync.useAsync = makeAsyncHookWithoutParamsReturnsString();

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveAsync('not an object')).toBe(false);
    expect(isReactiveAsync(123)).toBe(false);
    expect(isReactiveAsync(null)).toBe(false);
    expect(isReactiveAsync(undefined)).toBe(false);
    expect(isReactiveAsync({})).toBe(false);
    expect(isReactiveAsync({ notUseAsync: 'something' })).toBe(false);
    expect(isReactiveAsync({ useAsync: 'not a function' })).toBe(false);
  });
});
