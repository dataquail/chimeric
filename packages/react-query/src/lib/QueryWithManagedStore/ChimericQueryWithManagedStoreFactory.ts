import {
  queryOptions,
  type QueryClient,
  type QueryKey,
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
  options: {
    getFromStore: () => TResult;
    useFromStore: () => TResult;
    getQueryOptions: () => ReturnType<
      typeof queryOptions<void, E, void, TQueryKey>
    >;
  },
): ChimericQuery<undefined, TResult, E, TQueryKey>;

export function ChimericQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  options: {
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
    getQueryOptions: (
      args: TParams,
    ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
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
  options: {
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
    getQueryOptions: (
      args: TParams,
    ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
  },
): ChimericQuery<TParams, TResult, E, TQueryKey> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory(
      queryClient,
      options as {
        getFromStore: (
          args: TParams extends object ? TParams : object,
        ) => TResult;
        getQueryOptions: (
          params: TParams extends object ? TParams : object,
        ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
      },
    ),
    reactive: ReactiveQueryWithManagedStoreFactory(
      options as {
        useFromStore: (
          args: TParams extends object ? TParams : object,
        ) => TResult;
        getQueryOptions: (
          params: TParams extends object ? TParams : object,
        ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
      },
    ),
  }) as ChimericQuery<TParams, TResult, E, TQueryKey>;
}
