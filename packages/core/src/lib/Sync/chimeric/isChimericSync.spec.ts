/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeSyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isChimericSync } from './isChimericSync';

describe('isChimericSync', () => {
  it('should return true for a chimeric sync function', () => {
    const mockChimericSync = makeSyncFnWithoutParamsReturnsString() as any;
    mockChimericSync.use = makeSyncFnWithoutParamsReturnsString();

    expect(isChimericSync(mockChimericSync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericSync('not a function')).toBe(false);

    // Function without use
    const mockSyncFn = makeSyncFnWithoutParamsReturnsString();
    expect(isChimericSync(mockSyncFn)).toBe(false);

    // Object with use but not a function
    const mockReactiveSync = {
      use: makeSyncFnWithoutParamsReturnsString(),
    };
    expect(isChimericSync(mockReactiveSync)).toBe(false);

    // Other invalid inputs
    expect(isChimericSync(123)).toBe(false);
    expect(isChimericSync(null)).toBe(false);
    expect(isChimericSync(undefined)).toBe(false);
    expect(isChimericSync({})).toBe(false);
  });
});
