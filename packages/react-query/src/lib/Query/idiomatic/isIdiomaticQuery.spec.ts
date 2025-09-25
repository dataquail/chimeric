import { makeIdiomaticQueryWithoutParamsReturnsString } from '../__tests__/queryFixtures';
import { isIdiomaticQuery } from './isIdiomaticQuery';

describe('isIdiomaticQuery', () => {
  it('should return true for a function', () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();

    expect(isIdiomaticQuery(mockIdiomaticQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticQuery('not a function')).toBe(false);
    expect(isIdiomaticQuery(123)).toBe(false);
    expect(isIdiomaticQuery({})).toBe(false);
    expect(isIdiomaticQuery(null)).toBe(false);
    expect(isIdiomaticQuery(undefined)).toBe(false);
  });
});
