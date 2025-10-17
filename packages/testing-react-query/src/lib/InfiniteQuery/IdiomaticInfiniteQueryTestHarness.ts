import {
  IdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
} from '@chimeric/core';
import {
  QueryKey,
  TanstackInfiniteQueryIdiomaticNativeOptions,
} from '@chimeric/react-query';
import { IdiomaticInfiniteQueryTestHarness as CoreIdiomaticInfiniteQueryTestHarness } from '@chimeric/testing-core';
import { IdiomaticInfiniteQueryTestHarnessReturnType } from './types.js';

// Required params
export function IdiomaticInfiniteQueryTestHarness<
  TParams,
  TPageData,
  TPageParam,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TanstackInfiniteQueryIdiomaticNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >
  >;
  params: TParams;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;

// Optional params
export function IdiomaticInfiniteQueryTestHarness<
  TParams,
  TPageData,
  TPageParam,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TanstackInfiniteQueryIdiomaticNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >
  >;
  params?: NonNullable<TParams>;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;

// No params
export function IdiomaticInfiniteQueryTestHarness<
  TPageData,
  TPageParam,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TanstackInfiniteQueryIdiomaticNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >
  >;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;

// Implementation
export function IdiomaticInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TanstackInfiniteQueryIdiomaticNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >
  >;
  params?: TParams;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError> {
  return CoreIdiomaticInfiniteQueryTestHarness(args);
}
