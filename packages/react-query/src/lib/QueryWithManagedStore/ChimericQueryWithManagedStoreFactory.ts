import {
  queryOptions,
  type QueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { type ChimericQuery } from '../Query/chimeric/types';
import { IdiomaticQueryWithManagedStoreFactory } from './IdiomaticQueryWithManagedStoreFactory';
import { ReactiveQueryWithManagedStoreFactory } from './ReactiveQueryWithManagedStoreFactory';
import { fuseChimericQuery } from '../Query/chimeric/fuseChimericQuery';

// Required params (must come first - most specific)
export function ChimericQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: (params: TParams) => TResult;
  useFromStore: (params: TParams) => TResult;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey>;

// Optional params (must come before no params)
export function ChimericQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: (params?: TParams) => TResult;
  useFromStore: (params?: TParams) => TResult;
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params (least specific - must come last)
export function ChimericQueryWithManagedStoreFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: () => TResult;
  useFromStore: () => TResult;
  getQueryOptions: () => ReturnType<
    typeof queryOptions<void, TError, void, TQueryKey>
  >;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ChimericQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: (params?: TParams) => TResult;
  useFromStore: (params?: TParams) => TResult;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  const { queryClient, getFromStore, useFromStore, getQueryOptions } = config;
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getFromStore,
      getQueryOptions,
    }),
    reactive: ReactiveQueryWithManagedStoreFactory({
      useFromStore,
      getQueryOptions,
    }),
  }) as ChimericQuery<TParams, TResult, TError, TQueryKey>;
}
