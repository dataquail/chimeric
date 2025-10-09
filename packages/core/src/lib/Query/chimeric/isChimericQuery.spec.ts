/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import {
  makeIdiomaticQueryWithOptionalParamsReturnsString,
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeIdiomaticQueryWithParamsReturnsString,
  makeReactiveQueryWithOptionalParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';
import { fuseChimericQuery } from './fuseChimericQuery';
import { isChimericQuery } from './isChimericQuery';

describe('isChimericQuery', () => {
  it('should return true for a chimeric query function', () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    const mockChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    expect(isChimericQuery(mockChimericQuery)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericQuery('not a function' as any)).toBe(false);

    // Function without use
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    expect(isChimericQuery(mockQueryFn as any)).toBe(false);

    // Object with use but not a function
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    expect(isChimericQuery(mockReactiveQuery as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericQuery(123 as any)).toBe(false);
    expect(isChimericQuery(null as any)).toBe(false);
    expect(isChimericQuery(undefined as any)).toBe(false);
    expect(isChimericQuery({} as any)).toBe(false);
  });

  it('should handle no params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    const mockChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    expect(isChimericQuery(mockChimericQuery)).toBe(true);

    if (isChimericQuery(mockChimericQuery)) {
      const idiomaticResult = mockChimericQuery();
      await expect(idiomaticResult).resolves.toBe('test');

      const reactiveResult = mockChimericQuery.use();
      expect(reactiveResult.data).toBe('test');

      try {
        // @ts-expect-error - no params expected
        mockChimericQuery('test');
      } catch {
        // Expected error
      }

      try {
        // @ts-expect-error - no params expected
        mockChimericQuery.use('test');
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isChimericQuery returned true, but type guard failed');
    }
  });

  it('should handle params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const mockChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    expect(isChimericQuery(mockChimericQuery)).toBe(true);

    if (isChimericQuery(mockChimericQuery)) {
      const idiomaticResult = mockChimericQuery({ name: 'John' });
      await expect(idiomaticResult).resolves.toBe('Hello John');

      const reactiveResult = mockChimericQuery.use({ name: 'John' });
      expect(reactiveResult.data).toBe('Hello John');

      try {
        // @ts-expect-error - missing params
        mockChimericQuery();
      } catch {
        // Expected error
      }

      try {
        // @ts-expect-error - missing params
        mockChimericQuery.use();
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isChimericQuery returned true, but type guard failed');
    }
  });

  it('should handle optional params', async () => {
    const mockIdiomaticQuery =
      makeIdiomaticQueryWithOptionalParamsReturnsString();
    const mockReactiveQuery =
      makeReactiveQueryWithOptionalParamsReturnsString();
    const mockChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    expect(isChimericQuery(mockChimericQuery)).toBe(true);

    if (isChimericQuery(mockChimericQuery)) {
      const idiomaticResultWithParams = mockChimericQuery({ name: 'John' });
      await expect(idiomaticResultWithParams).resolves.toBe('Hello John');

      const idiomaticResultWithoutParams = mockChimericQuery();
      await expect(idiomaticResultWithoutParams).resolves.toBe('Hello');

      const reactiveResultWithParams = mockChimericQuery.use({ name: 'John' });
      expect(reactiveResultWithParams.data).toBe('Hello John');

      const reactiveResultWithoutParams = mockChimericQuery.use();
      expect(reactiveResultWithoutParams.data).toBe('Hello');

      try {
        // @ts-expect-error - wrong param type
        mockChimericQuery(1);
      } catch {
        // Expected error
      }

      try {
        // @ts-expect-error - wrong param type
        mockChimericQuery.use(1);
      } catch {
        // Expected error
      }
    } else {
      throw new Error('isChimericQuery returned true, but type guard failed');
    }
  });
});
