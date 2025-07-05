import { makeReactiveQueryWithoutParamsReturnsString } from '../__tests__/queryFixtures';
import { isReactiveQuery } from './isReactiveQuery';

describe('isReactiveQuery', () => {
  it('should return true for an object with use function', () => {
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveQuery('not an object')).toBe(false);
    expect(isReactiveQuery(123)).toBe(false);
    expect(isReactiveQuery(null)).toBe(false);
    expect(isReactiveQuery(undefined)).toBe(false);
    expect(isReactiveQuery({})).toBe(false);
    expect(isReactiveQuery({ notUse: 'something' })).toBe(false);
    expect(isReactiveQuery({ use: 'not a function' })).toBe(false);
  });
});
