import {
  queryOptions,
  type QueryKey,
  type QueryClient,
} from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import { ReactiveQueryFactory } from '../reactive/ReactiveQueryFactory';
import { fuseChimericQuery } from './fuseChimericQuery';
import { type ChimericQuery } from './types';

// Overloads
export function ChimericQueryFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, E, TResult, TQueryKey>
  >,
): ChimericQuery<undefined, TResult, E, TQueryKey>;
export function ChimericQueryFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
): ChimericQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function ChimericQueryFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
): ChimericQuery<TParams, TResult, E, TQueryKey> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryFactory(
      queryClient,
      getQueryOptions as () => ReturnType<
        typeof queryOptions<TResult, E, TResult, TQueryKey>
      >,
    ),
    reactive: ReactiveQueryFactory(
      getQueryOptions as () => ReturnType<
        typeof queryOptions<TResult, E, TResult, TQueryKey>
      >,
    ),
  }) as ChimericQuery<TParams, TResult, E, TQueryKey>;
}
