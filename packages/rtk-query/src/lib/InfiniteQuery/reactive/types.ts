import {
  ReactiveInfiniteQuery as CoreReactiveInfiniteQuery,
  DefineReactiveInfiniteQuery as CoreDefineReactiveInfiniteQuery,
} from '@chimeric/core';
import type {
  BaseQueryFn,
  PrefetchOptions,
  SubscriptionOptions,
} from '@reduxjs/toolkit/query';
import type {
  TypedUseInfiniteQueryHookResult,
  TypedUseInfiniteQueryStateOptions,
} from '@reduxjs/toolkit/query/react';

export type RtkInfiniteQueryReactiveNativeOptions<
  TPageData = unknown,
  TArg = void,
  TPageParam = unknown,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = SubscriptionOptions & {
  skip?: boolean;
  refetchOnMountOrArgChange?: boolean | number;
  initialPageParam?: TPageParam;
} & TypedUseInfiniteQueryStateOptions<TPageData, TArg, TPageParam, BaseQuery>;

export type RtkInfiniteQueryReactiveReturnType<
  TPageData = unknown,
  TArg = void,
  TPageParam = unknown,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = TypedUseInfiniteQueryHookResult<TPageData, TArg, TPageParam, BaseQuery>;

export type RtkInfiniteQueryReactivePrefetchNativeOptions = PrefetchOptions;

export type ReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  RtkInfiniteQueryReactiveNativeOptions<TPageData, TParams, TPageParam, BaseQuery>,
  RtkInfiniteQueryReactiveReturnType<TPageData, TParams, TPageParam, BaseQuery>,
  RtkInfiniteQueryReactivePrefetchNativeOptions
>;

export type DefineReactiveInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreDefineReactiveInfiniteQuery<
  T,
  TPageData,
  TPageParam,
  TError,
  RtkInfiniteQueryReactiveNativeOptions<
    TPageData,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    TPageParam,
    BaseQuery
  >,
  RtkInfiniteQueryReactiveReturnType<
    TPageData,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    TPageParam,
    BaseQuery
  >,
  RtkInfiniteQueryReactivePrefetchNativeOptions
>;
