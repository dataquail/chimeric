/* eslint-disable @typescript-eslint/no-explicit-any */
import { isChimericSync } from './isChimericSync';
import { fuseChimericSync } from './fuseChimericSync';
import {
  makeIdiomaticSyncWithoutParamsReturnsString,
  makeReactiveSyncWithoutParamsReturnsString,
} from '../__tests__/syncFixtures';
import { makeSyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';

describe('isChimericSync', () => {
  it('should handle no params', () => {
    const mockIdiomaticSync = makeIdiomaticSyncWithoutParamsReturnsString();
    const mockReactiveSync = makeReactiveSyncWithoutParamsReturnsString();
    const mockChimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });

    expect(isChimericSync(mockChimericSync)).toBe(true);
    if (isChimericSync(mockChimericSync)) {
      const result = mockChimericSync();
      expect(result).toBe('test');

      const reactiveResult = mockChimericSync.use();
      expect(reactiveResult).toBe('test');

      try {
        // @ts-expect-error
        mockChimericSync('test');
      } catch (e) {
        // Expected error
      }

      try {
        // @ts-expect-error
        mockChimericSync.use('test');
      } catch (e) {
        // Expected error
      }
    } else {
      throw new Error('isChimericSync returned false negative');
    }
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericSync('not a function' as any)).toBe(false);

    // Function without use
    const mockSyncFn = makeSyncFnWithoutParamsReturnsString();
    expect(isChimericSync(mockSyncFn as any)).toBe(false);

    // Object with use but not a function
    const mockReactiveSync = {
      use: makeSyncFnWithoutParamsReturnsString(),
    };
    expect(isChimericSync(mockReactiveSync as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericSync(123 as any)).toBe(false);
    expect(isChimericSync(null as any)).toBe(false);
    expect(isChimericSync(undefined as any)).toBe(false);
    expect(isChimericSync({} as any)).toBe(false);
  });
});
