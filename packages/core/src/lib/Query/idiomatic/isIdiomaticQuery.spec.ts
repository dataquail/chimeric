/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeAsyncFnWithOptionalParamsReturnsString,
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { isIdiomaticQuery } from './isIdiomaticQuery';
import { createIdiomaticQuery } from './createIdiomaticQuery';

describe('isIdiomaticQuery', () => {
  it('should return true for a properly marked idiomatic query function', () => {
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(isIdiomaticQuery(idiomaticQuery)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticQuery('not a function' as any)).toBe(false);
    expect(isIdiomaticQuery(123 as any)).toBe(false);
    expect(isIdiomaticQuery({} as any)).toBe(false);
    expect(isIdiomaticQuery(null as any)).toBe(false);
    expect(isIdiomaticQuery(undefined as any)).toBe(false);
  });

  it('should handle no params', async () => {
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(isIdiomaticQuery(idiomaticQuery)).toBe(true);

    if (isIdiomaticQuery(idiomaticQuery)) {
      const result = await idiomaticQuery();
      expect(result).toBe('test');

      try {
        // @ts-expect-error - no params expected
        idiomaticQuery('test');
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isIdiomaticQuery returned true, but type guard failed');
    }
  });

  it('should handle params', async () => {
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(isIdiomaticQuery(idiomaticQuery)).toBe(true);

    if (isIdiomaticQuery(idiomaticQuery)) {
      const result = await idiomaticQuery({ name: 'John' });
      expect(result).toBe('Hello John');

      try {
        // @ts-expect-error - expected params
        idiomaticQuery();
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isIdiomaticQuery returned true, but type guard failed');
    }
  });

  it('should handle optional params', async () => {
    const mockQueryFn = makeAsyncFnWithOptionalParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(isIdiomaticQuery(idiomaticQuery)).toBe(true);

    if (isIdiomaticQuery(idiomaticQuery)) {
      const resultWithParams = await idiomaticQuery({ name: 'John' });
      expect(resultWithParams).toBe('Hello John');

      const resultWithoutParams = await idiomaticQuery();
      expect(resultWithoutParams).toBe('Hello');
      try {
        // @ts-expect-error - wrong param type
        idiomaticQuery(1);
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isIdiomaticQuery returned true, but type guard failed');
    }
  });
});
