/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTestFixtures } from '../__tests__/queryFixtures';
import { isIdiomaticQuery } from './isIdiomaticQuery';

describe('isIdiomaticQuery', () => {
  it('should return true for a function', () => {
    const testIdiomaticQuery =
      QueryTestFixtures.withoutParams.getIdiomatic().idiomaticQuery;
    expect(isIdiomaticQuery(testIdiomaticQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticQuery('not a function' as any)).toBe(false);
    expect(isIdiomaticQuery(123 as any)).toBe(false);
    expect(isIdiomaticQuery({} as any)).toBe(false);
    expect(isIdiomaticQuery(null as any)).toBe(false);
    expect(isIdiomaticQuery(undefined as any)).toBe(false);
  });
});
