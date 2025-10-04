import {
  queryOptions,
  type QueryKey,
  type QueryClient,
} from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import { ReactiveQueryFactory } from '../reactive/ReactiveQueryFactory';
import { fuseChimericQuery } from './fuseChimericQuery';
import { type ChimericQuery } from './types';

// Required params (must come first - most specific)
export function ChimericQueryFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey>;

// Optional params (must come before no params)
export function ChimericQueryFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params (least specific - must come last)
export function ChimericQueryFactory<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, TError, TResult, TQueryKey>
  >;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ChimericQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ChimericQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getQueryOptions,
}: {
  queryClient: QueryClient;
  getQueryOptions: any;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryFactory({ queryClient, getQueryOptions }),
    reactive: ReactiveQueryFactory({ getQueryOptions }),
  }) as ChimericQuery<TParams, TResult, TError, TQueryKey>;
}
