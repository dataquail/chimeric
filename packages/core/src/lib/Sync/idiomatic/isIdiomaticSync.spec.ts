/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeIdiomaticSyncWithOptionalParamsReturnsString,
  makeIdiomaticSyncWithoutParamsReturnsString,
  makeIdiomaticSyncWithParamsReturnsString,
} from '../__tests__/syncFixtures';
import { isIdiomaticSync } from './isIdiomaticSync';

describe('isIdiomaticSync', () => {
  it('should handle no params', () => {
    const mockIdiomaticSync = makeIdiomaticSyncWithoutParamsReturnsString();

    expect(isIdiomaticSync(mockIdiomaticSync)).toBe(true);

    if (isIdiomaticSync(mockIdiomaticSync)) {
      const result = mockIdiomaticSync();
      expect(result).toBe('test');

      try {
        // @ts-expect-error - no params expected
        mockIdiomaticSync('test');
      } catch {
        // Expected error
      }
    }
  });

  it('should handle params', () => {
    const mockIdiomaticSync = makeIdiomaticSyncWithParamsReturnsString();

    expect(isIdiomaticSync(mockIdiomaticSync)).toBe(true);

    if (isIdiomaticSync(mockIdiomaticSync)) {
      const result = mockIdiomaticSync({ name: 'John' });
      expect(result).toBe('Hello John');

      try {
        // @ts-expect-error - missing params
        mockIdiomaticSync();
      } catch {
        // Expected error
      }
    }
  });

  it('should handle optional params', () => {
    const mockIdiomaticSync =
      makeIdiomaticSyncWithOptionalParamsReturnsString();

    expect(isIdiomaticSync(mockIdiomaticSync)).toBe(true);

    if (isIdiomaticSync(mockIdiomaticSync)) {
      const resultWithParams = mockIdiomaticSync({ name: 'John' });
      expect(resultWithParams).toBe('Hello John');

      const resultWithoutParams = mockIdiomaticSync();
      expect(resultWithoutParams).toBe('Hello');

      try {
        // @ts-expect-error - wrong param type
        mockIdiomaticSync(1);
      } catch {
        // Expected error
      }
    }
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticSync('not a function' as any)).toBe(false);
    expect(isIdiomaticSync(123 as any)).toBe(false);
    expect(isIdiomaticSync({} as any)).toBe(false);
    expect(isIdiomaticSync(null as any)).toBe(false);
    expect(isIdiomaticSync(undefined as any)).toBe(false);
  });
});
