/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTestFixtures } from '../__tests__/queryFixtures';
import { isReactiveQuery } from './isReactiveQuery';

describe('isReactiveQuery', () => {
  it('should return true for an object with use function', () => {
    const mockReactiveQuery =
      QueryTestFixtures.withoutParams.getReactive().reactiveQuery;
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
});
