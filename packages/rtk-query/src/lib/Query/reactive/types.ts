import {
  ReactiveQuery as CoreReactiveQuery,
  DefineReactiveQuery as CoreDefineReactiveQuery,
} from '@chimeric/core';
import type {
  BaseQueryFn,
  PrefetchOptions,
  SubscriptionOptions,
} from '@reduxjs/toolkit/query';
import type {
  TypedUseQueryHookResult,
  TypedUseQueryStateOptions,
} from '@reduxjs/toolkit/query/react';

export type RtkQueryReactiveNativeOptions<
  TResult = unknown,
  TArg = void,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
} & TypedUseQueryStateOptions<TResult, TArg, BaseQuery>;

export type RtkQueryReactiveReturnType<
  TResult = unknown,
  TArg = void,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = TypedUseQueryHookResult<TResult, TArg, BaseQuery>;

export type RtkQueryReactivePrefetchNativeOptions = PrefetchOptions;

export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreReactiveQuery<
  TParams,
  TResult,
  TError,
  RtkQueryReactiveNativeOptions<TResult, TParams, BaseQuery>,
  RtkQueryReactiveReturnType<TResult, TParams, BaseQuery>,
  RtkQueryReactivePrefetchNativeOptions
>;

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreDefineReactiveQuery<
  T,
  TError,
  RtkQueryReactiveNativeOptions<
    Awaited<ReturnType<T>>,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    BaseQuery
  >,
  RtkQueryReactiveReturnType<
    Awaited<ReturnType<T>>,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    BaseQuery
  >,
  RtkQueryReactivePrefetchNativeOptions
>;
