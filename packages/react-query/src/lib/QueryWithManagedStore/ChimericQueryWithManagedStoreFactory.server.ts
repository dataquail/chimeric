import {
  queryOptions,
  type QueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { type ChimericQuery } from '../Query/chimeric/types';
import { IdiomaticQueryWithManagedStoreFactory } from './IdiomaticQueryWithManagedStoreFactory';
import { createReactiveQuery } from '../Query/reactive/createReactiveQuery';
import { fuseChimericQuery } from '../Query/chimeric/fuseChimericQuery';
import { throwHookServerError } from '../serverErrors';

// Required params
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

// Optional params
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

// No params
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
  const { queryClient, getFromStore, getQueryOptions } = config;
  const idiomatic = IdiomaticQueryWithManagedStoreFactory({
    queryClient,
    getFromStore,
    getQueryOptions,
  });
  const stubUseHook = () => throwHookServerError('useHook');
  const stubPrefetchHook = () => throwHookServerError('usePrefetchHook');
  const reactive = createReactiveQuery(stubUseHook, stubPrefetchHook);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chimeric = fuseChimericQuery({ idiomatic, reactive } as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (chimeric as any).useSuspenseHook = () =>
    throwHookServerError('useSuspenseHook');
  return chimeric as ChimericQuery<TParams, TResult, TError, TQueryKey>;
}
