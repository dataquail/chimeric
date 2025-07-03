import { makeReactiveQueryWithoutParamsReturnsString } from '../__tests__/queryFixtures';
import { isReactiveQuery } from './isReactiveQuery';

describe('isReactiveQuery', () => {
  it('should return true for an object with useQuery function', () => {
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();

    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveQuery('not an object')).toBe(false);
    expect(isReactiveQuery(123)).toBe(false);
    expect(isReactiveQuery(null)).toBe(false);
    expect(isReactiveQuery(undefined)).toBe(false);
    expect(isReactiveQuery({})).toBe(false);
    expect(isReactiveQuery({ notUseQuery: 'something' })).toBe(false);
    expect(isReactiveQuery({ useQuery: 'not a function' })).toBe(false);
  });
});
