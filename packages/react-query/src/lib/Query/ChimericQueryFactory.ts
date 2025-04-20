import { type QueryClient, type QueryOptions } from '@tanstack/react-query';
import { ChimericQuery, fuseChimericQuery } from '@chimeric/core';
import { IdiomaticQueryFactory } from './IdiomaticQueryFactory';
import { ReactiveQueryFactory } from './ReactiveQueryFactory';

// Overloads
export function ChimericQueryFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: () => QueryOptions<TResult, E, TResult, string[]>,
): ChimericQuery<undefined, TResult, E>;
export function ChimericQueryFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): ChimericQuery<TParams, TResult, E>;

// Implementation
export function ChimericQueryFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): ChimericQuery<TParams, TResult, E> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryFactory(
      queryClient,
      getQueryOptions as () => QueryOptions<TResult, E, TResult, string[]>,
    ),
    reactive: ReactiveQueryFactory(
      getQueryOptions as () => QueryOptions<TResult, E, TResult, string[]>,
    ),
  }) as ChimericQuery<TParams, TResult, E>;
}
