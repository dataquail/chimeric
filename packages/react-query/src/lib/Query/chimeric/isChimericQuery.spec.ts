/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
} from '../__tests__/queryFixtures';
import { fuseChimericQuery } from './fuseChimericQuery';
import { isChimericQuery } from './isChimericQuery';
import { UseQueryResult } from '@tanstack/react-query';

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
    const mockQueryFn = vi.fn(async () => 'test');
    expect(isChimericQuery(mockQueryFn as any)).toBe(false);

    // Object with use but not a function
    const mockReactiveQuery = {
      use: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(() => Promise.resolve('test')),
        native: {} as UseQueryResult<string, Error>,
      })),
    };
    expect(isChimericQuery(mockReactiveQuery as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericQuery(123 as any)).toBe(false);
    expect(isChimericQuery(null as any)).toBe(false);
    expect(isChimericQuery(undefined as any)).toBe(false);
    expect(isChimericQuery({} as any)).toBe(false);
  });
});
