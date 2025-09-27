import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { isChimericInfiniteQuery } from './isChimericInfiniteQuery';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';
import { IdiomaticInfiniteQueryFactory } from '../idiomatic/IdiomaticInfiniteQueryFactory';
import { ReactiveInfiniteQueryFactory } from '../reactive/ReactiveInfiniteQueryFactory';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('isChimericInfiniteQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('should return true for a valid chimeric infinite query', () => {
    const mockQueryFn = vi.fn(async () => ({
      items: ['test'],
      nextCursor: null,
    }));

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      () =>
        infiniteQueryOptions({
          queryKey: ['test'],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory(() =>
      infiniteQueryOptions({
        queryKey: ['test'],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    expect(isChimericInfiniteQuery(chimericInfiniteQuery)).toBe(true);
  });

  it('should return false for non-chimeric values', () => {
    expect(isChimericInfiniteQuery('not a query')).toBe(false);
    expect(isChimericInfiniteQuery(123)).toBe(false);
    expect(isChimericInfiniteQuery({})).toBe(false);
    expect(isChimericInfiniteQuery(null)).toBe(false);
    expect(isChimericInfiniteQuery(undefined)).toBe(false);
    expect(isChimericInfiniteQuery(vi.fn())).toBe(false);
  });

  it('should return false for functions without use property', () => {
    const regularFunction = vi.fn(async () => ({ pages: [], pageParams: [] }));
    expect(isChimericInfiniteQuery(regularFunction)).toBe(false);
  });

  it('should return false for objects with use property that are not functions', () => {
    const notChimeric = {
      use: 'not a function',
    };
    expect(isChimericInfiniteQuery(notChimeric)).toBe(false);
  });

  it('should return true for chimeric infinite query with parameters', () => {
    const mockQueryFn = vi.fn(async ({ queryKey }) => {
      const [, params] = queryKey as [string, { search: string }];
      return {
        items: [params.search],
        nextCursor: null,
      };
    });

    const idiomaticInfiniteQuery = IdiomaticInfiniteQueryFactory(
      queryClient,
      (params) =>
        infiniteQueryOptions({
          queryKey: ['test', params],
          queryFn: mockQueryFn,
          initialPageParam: 0,
          getNextPageParam: () => null,
        }),
    );

    const reactiveInfiniteQuery = ReactiveInfiniteQueryFactory((params) =>
      infiniteQueryOptions({
        queryKey: ['test', params],
        queryFn: mockQueryFn,
        initialPageParam: 0,
        getNextPageParam: () => null,
      }),
    );

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    expect(isChimericInfiniteQuery(chimericInfiniteQuery)).toBe(true);
  });
});
