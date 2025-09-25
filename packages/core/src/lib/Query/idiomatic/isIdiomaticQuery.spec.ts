import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import { isIdiomaticQuery } from './isIdiomaticQuery';
import { createIdiomaticQuery } from './createIdiomaticQuery';

describe('isIdiomaticQuery', () => {
  it('should return true for a properly marked idiomatic query function', () => {
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(isIdiomaticQuery(idiomaticQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticQuery('not a function')).toBe(false);
    expect(isIdiomaticQuery(123)).toBe(false);
    expect(isIdiomaticQuery({})).toBe(false);
    expect(isIdiomaticQuery(null)).toBe(false);
    expect(isIdiomaticQuery(undefined)).toBe(false);
  });
});
