/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeIdiomaticQueryWithoutParamsReturnsString } from '../__tests__/queryFixtures';
import { isIdiomaticQuery } from './isIdiomaticQuery';

describe('isIdiomaticQuery', () => {
  it('should return true for a function', () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();

    expect(isIdiomaticQuery(mockIdiomaticQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticQuery('not a function' as any)).toBe(false);
    expect(isIdiomaticQuery(123 as any)).toBe(false);
    expect(isIdiomaticQuery({} as any)).toBe(false);
    expect(isIdiomaticQuery(null as any)).toBe(false);
    expect(isIdiomaticQuery(undefined as any)).toBe(false);
  });
});
