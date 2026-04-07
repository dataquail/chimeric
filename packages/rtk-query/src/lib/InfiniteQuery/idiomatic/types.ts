import {
  IdiomaticInfiniteQuery as CoreIdiomaticInfiniteQuery,
  DefineIdiomaticInfiniteQuery as CoreDefineIdiomaticInfiniteQuery,
} from '@chimeric/core';
import type { StartQueryActionCreatorOptions } from '@reduxjs/toolkit/query';

export type RtkInfiniteQueryIdiomaticNativeOptions =
  StartQueryActionCreatorOptions & {
    direction?: 'forward' | 'backward';
    param?: unknown;
  };

export type IdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
> = CoreIdiomaticInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  RtkInfiniteQueryIdiomaticNativeOptions
>;

export type DefineIdiomaticInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
> = CoreDefineIdiomaticInfiniteQuery<
  T,
  TPageData,
  TPageParam,
  RtkInfiniteQueryIdiomaticNativeOptions
>;
