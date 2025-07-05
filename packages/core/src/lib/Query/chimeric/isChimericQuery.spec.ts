/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import {
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
} from '../__tests__/queryFixtures';
import { isChimericQuery } from './isChimericQuery';

describe('isChimericQuery', () => {
  it('should return true for a chimeric query function', () => {
    const mockChimericQuery =
      makeIdiomaticQueryWithoutParamsReturnsString() as any;
    mockChimericQuery.use = makeReactiveQueryWithoutParamsReturnsString().use;

    expect(isChimericQuery(mockChimericQuery)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericQuery('not a function')).toBe(false);

    // Function without use
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isChimericQuery(mockQueryFn)).toBe(false);

    // Object with use but not a function
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    expect(isChimericQuery(mockReactiveQuery)).toBe(false);

    // Other invalid inputs
    expect(isChimericQuery(123)).toBe(false);
    expect(isChimericQuery(null)).toBe(false);
    expect(isChimericQuery(undefined)).toBe(false);
    expect(isChimericQuery({})).toBe(false);
  });
});
