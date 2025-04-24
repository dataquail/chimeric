import {
  type QueryClient,
  type QueryKey,
  queryOptions,
} from '@tanstack/react-query';
import { type ChimericQuery } from '../Query/chimeric/types';
import { IdiomaticQueryWithManagedStoreFactory } from './IdiomaticQueryWithManagedStoreFactory';
import { ReactiveQueryWithManagedStoreFactory } from './ReactiveQueryWithManagedStoreFactory';
import { fuseChimericQuery } from '../Query/chimeric/fuseChimericQuery';

// Overloads
export function ChimericQueryWithManagedStoreFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  {
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    getQueryOptions: () => ReturnType<
      typeof queryOptions<TResult, E, TResult, TQueryKey>
    >;
    getFromStore: () => TResult;
    useFromStore: () => TResult;
  },
): ChimericQuery<undefined, TResult, E, TQueryKey>;

export function ChimericQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  {
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>;
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
  },
): ChimericQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function ChimericQueryWithManagedStoreFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  {
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    getQueryOptions: (
      params: TParams,
    ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>;
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
  },
): ChimericQuery<TParams, TResult, E, TQueryKey> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory(queryClient, {
      getQueryOptions,
      getFromStore,
    } as {
      getQueryOptions: () => ReturnType<
        typeof queryOptions<TResult, E, TResult, TQueryKey>
      >;
      getFromStore: () => TResult;
    }),
    reactive: ReactiveQueryWithManagedStoreFactory({
      getQueryOptions,
      useFromStore,
    } as {
      getQueryOptions: () => ReturnType<
        typeof queryOptions<TResult, E, TResult, TQueryKey>
      >;
      useFromStore: () => TResult;
    }),
  }) as ChimericQuery<TParams, TResult, E, TQueryKey>;
}
