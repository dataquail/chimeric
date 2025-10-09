import {
  makeReactiveQueryWithOptionalParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';
import { isReactiveQuery } from './isReactiveQuery';

describe('isReactiveQuery', () => {
  it('should return true for an object with use function', () => {
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveQuery('not an object' as any)).toBe(false);
    expect(isReactiveQuery(123 as any)).toBe(false);
    expect(isReactiveQuery(null as any)).toBe(false);
    expect(isReactiveQuery(undefined as any)).toBe(false);
    expect(isReactiveQuery({} as any)).toBe(false);
    expect(isReactiveQuery({ notUse: 'something' } as any)).toBe(false);
    expect(isReactiveQuery({ use: 'not a function' } as any)).toBe(false);
  });

  it('should handle no params', () => {
    const mockReactiveSync = makeReactiveQueryWithoutParamsReturnsString();

    expect(isReactiveQuery(mockReactiveSync)).toBe(true);

    if (isReactiveQuery(mockReactiveSync)) {
      const result = mockReactiveSync.use();
      expect(result.data).toBe('test');

      try {
        // @ts-expect-error - no params expected
        mockReactiveSync('test');
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isReactiveQuery returned true, but type guard failed');
    }
  });

  it('should handle params', () => {
    const mockReactiveSync = makeReactiveQueryWithParamsReturnsString();

    expect(isReactiveQuery(mockReactiveSync)).toBe(true);

    if (isReactiveQuery(mockReactiveSync)) {
      const result = mockReactiveSync.use({ name: 'John' });
      expect(result.data).toBe('Hello John');

      try {
        // @ts-expect-error - expected params
        mockReactiveSync();
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isReactiveQuery returned true, but type guard failed');
    }
  });

  it('should handle optional params', () => {
    const mockReactiveSync = makeReactiveQueryWithOptionalParamsReturnsString();

    expect(isReactiveQuery(mockReactiveSync)).toBe(true);

    if (isReactiveQuery(mockReactiveSync)) {
      const resultWithParams = mockReactiveSync.use({ name: 'John' });
      expect(resultWithParams.data).toBe('Hello John');

      const resultWithoutParams = mockReactiveSync.use();
      expect(resultWithoutParams.data).toBe('Hello');

      try {
        // @ts-expect-error - wrong param type
        mockReactiveSync(1);
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isReactiveQuery returned true, but type guard failed');
    }
  });
});
