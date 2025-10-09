/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeReactiveSyncWithOptionalParamsReturnsString,
  makeReactiveSyncWithoutParamsReturnsString,
  makeReactiveSyncWithParamsReturnsString,
} from '../__tests__/syncFixtures';
import { isReactiveSync } from './isReactiveSync';

describe('isReactiveSync', () => {
  it('should handle no params', () => {
    const mockReactiveSync = makeReactiveSyncWithoutParamsReturnsString();

    expect(isReactiveSync(mockReactiveSync)).toBe(true);

    if (isReactiveSync(mockReactiveSync)) {
      const result = mockReactiveSync.use();
      expect(result).toBe('test');

      try {
        // @ts-expect-error - no params expected
        mockReactiveSync('test');
      } catch {
        // Expected error
      }
    }
  });

  it('should handle params', () => {
    const mockReactiveSync = makeReactiveSyncWithParamsReturnsString();

    expect(isReactiveSync(mockReactiveSync)).toBe(true);

    if (isReactiveSync(mockReactiveSync)) {
      const result = mockReactiveSync.use({ name: 'John' });
      expect(result).toBe('Hello John');

      try {
        // @ts-expect-error - missing params
        mockReactiveSync();
      } catch {
        // Expected error
      }
    }
  });

  it('should handle optional params', () => {
    const mockReactiveSync = makeReactiveSyncWithOptionalParamsReturnsString();

    expect(isReactiveSync(mockReactiveSync)).toBe(true);

    if (isReactiveSync(mockReactiveSync)) {
      const resultWithParams = mockReactiveSync.use({ name: 'John' });
      expect(resultWithParams).toBe('Hello John');

      const resultWithoutParams = mockReactiveSync.use();
      expect(resultWithoutParams).toBe('Hello');

      try {
        // @ts-expect-error - wrong param type
        mockReactiveSync(1);
      } catch {
        // Expected error
      }
    }
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveSync('not an object' as any)).toBe(false);
    expect(isReactiveSync(123 as any)).toBe(false);
    expect(isReactiveSync(null as any)).toBe(false);
    expect(isReactiveSync(undefined as any)).toBe(false);
    expect(isReactiveSync({} as any)).toBe(false);
    expect(isReactiveSync({ notUse: 'something' } as any)).toBe(false);
    expect(isReactiveSync({ use: 'not a function' } as any)).toBe(false);
  });
});
