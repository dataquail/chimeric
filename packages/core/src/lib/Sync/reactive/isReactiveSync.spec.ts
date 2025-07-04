/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeSyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isReactiveSync } from './isReactiveSync';

describe('isReactiveSync', () => {
  it('should return true for an object with useSync function', () => {
    const mockReactiveSync = {
      useSync: makeSyncFnWithoutParamsReturnsString(),
    };

    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return true for a function with useSync property', () => {
    const mockReactiveSync = makeSyncFnWithoutParamsReturnsString() as any;
    mockReactiveSync.useSync = makeSyncFnWithoutParamsReturnsString();

    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveSync('not an object')).toBe(false);
    expect(isReactiveSync(123)).toBe(false);
    expect(isReactiveSync(null)).toBe(false);
    expect(isReactiveSync(undefined)).toBe(false);
    expect(isReactiveSync({})).toBe(false);
    expect(isReactiveSync({ notUseSync: 'something' })).toBe(false);
    expect(isReactiveSync({ useSync: 'not a function' })).toBe(false);
  });
});
