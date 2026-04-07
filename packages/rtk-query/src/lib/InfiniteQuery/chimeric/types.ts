import {
  ChimericInfiniteQuery as CoreChimericInfiniteQuery,
  DefineChimericInfiniteQuery as CoreDefineChimericInfiniteQuery,
} from '@chimeric/core';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { RtkInfiniteQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  RtkInfiniteQueryReactiveNativeOptions,
  RtkInfiniteQueryReactivePrefetchNativeOptions,
  RtkInfiniteQueryReactiveReturnType,
} from '../reactive/types';

export type ChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  RtkInfiniteQueryIdiomaticNativeOptions,
  RtkInfiniteQueryReactiveNativeOptions<TPageData, TParams, TPageParam, BaseQuery>,
  RtkInfiniteQueryReactiveReturnType<TPageData, TParams, TPageParam, BaseQuery>,
  RtkInfiniteQueryReactivePrefetchNativeOptions
>;

export type DefineChimericInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreDefineChimericInfiniteQuery<
  T,
  TPageData,
  TPageParam,
  TError,
  RtkInfiniteQueryIdiomaticNativeOptions,
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
