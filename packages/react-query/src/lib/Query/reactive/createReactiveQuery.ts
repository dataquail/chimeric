import {
  createReactiveQuery as coreCreateReactiveQuery,
  ReactiveQuery as CoreReactiveQuery,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { ReactiveQuery } from './types';
import {
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

export function createReactiveQuery<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (params?: {
    options?: ReactiveQueryOptions;
    nativeOptions?: UseQueryOptions<TResult, E, TResult, TQueryKey>;
  }) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    refetch: () => Promise<TResult>;
    native: UseQueryResult<TResult, E>;
  },
): ReactiveQuery<undefined, TResult, E, TQueryKey>;

export function createReactiveQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: (
    params: TParams & {
      options?: ReactiveQueryOptions;
      nativeOptions?: UseQueryOptions<TResult, E, TResult, TQueryKey>;
    },
  ) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    refetch: () => Promise<TResult>;
    native: UseQueryResult<TResult, E>;
  },
): ReactiveQuery<TParams, TResult, E, TQueryKey>;

export function createReactiveQuery<
  TParams extends undefined | object,
  TResult = unknown,
  TQueryKey extends QueryKey = QueryKey,
  E extends Error = Error,
>(
  reactiveFn: CoreReactiveQuery<
    TParams,
    TResult,
    E,
    UseQueryOptions<TResult, E, TResult, TQueryKey>,
    UseQueryResult<TResult, E>
  >['useQuery'],
): ReactiveQuery<TParams, TResult, E, TQueryKey> {
  return coreCreateReactiveQuery(reactiveFn) as ReactiveQuery<
    TParams,
    TResult,
    E,
    TQueryKey
  >;
}
