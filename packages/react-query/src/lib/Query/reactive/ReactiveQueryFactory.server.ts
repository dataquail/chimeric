import { queryOptions, type QueryKey } from '@tanstack/react-query';
import { type ReactiveQuery } from './types';
import { throwReactiveServerError } from '../../serverErrors';

// Required params
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey>;

// Optional params
export function ReactiveQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params
export function ReactiveQueryFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, TError, TResult, TQueryKey>
  >;
}): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ReactiveQueryFactory(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: { getQueryOptions: unknown },
): never {
  throwReactiveServerError('ReactiveQueryFactory');
}
