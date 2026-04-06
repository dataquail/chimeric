import { queryOptions, type QueryKey } from '@tanstack/react-query';
import { type ReactiveQuery } from '../Query/reactive/types';
import { throwReactiveServerError } from '../serverErrors';

// Required params
export function ReactiveQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  useFromStore: (params: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey>;

// Optional params
export function ReactiveQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  useFromStore: (params?: TParams) => TResult;
}): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params
export function ReactiveQueryWithManagedStoreFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: () => ReturnType<
    typeof queryOptions<void, TError, void, TQueryKey>
  >;
  useFromStore: () => TResult;
}): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ReactiveQueryWithManagedStoreFactory(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: { getQueryOptions: unknown; useFromStore: unknown },
): never {
  throwReactiveServerError('ReactiveQueryWithManagedStoreFactory');
}
