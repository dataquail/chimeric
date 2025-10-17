import { ChimericInfiniteQuery as CoreChimericInfiniteQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';
import { TanstackInfiniteQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  TanstackInfiniteQueryReactiveNativeOptions,
  TanstackInfiniteQueryReactiveReturnType,
} from '../reactive/types';

export type ChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = CoreChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
  TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
>;

export type DefineChimericInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Parameters<T> extends []
  ? ChimericInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>
  : ChimericInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TError,
      TQueryKey
    >;
