import {
  ReactiveInfiniteQuery,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import {
  QueryKey,
  TanstackInfiniteQueryReactiveNativeOptions,
  TanstackInfiniteQueryReactiveReturnType,
} from '@chimeric/react-query';
import { ReactiveInfiniteQueryTestHarness as CoreReactiveInfiniteQueryTestHarness } from '@chimeric/testing-core';
import { ReactiveInfiniteQueryTestHarnessReturnType } from './types.js';
import { JSX, ReactNode } from 'react';

// Required params
export function ReactiveInfiniteQueryTestHarness<
  TParams,
  TPageData,
  TPageParam,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >;
  params: TParams;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
>;

// Optional params
export function ReactiveInfiniteQueryTestHarness<
  TParams,
  TPageData,
  TPageParam,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >;
  params?: NonNullable<TParams>;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
>;

// No params
export function ReactiveInfiniteQueryTestHarness<
  TPageData,
  TPageParam,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
>;

// Implementation
export function ReactiveInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TanstackInfiniteQueryReactiveNativeOptions<
      TPageData,
      TError,
      TPageParam,
      TQueryKey
    >,
    TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
  >;
  params?: TParams;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
    TPageData,
    TError,
    TPageParam,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
> {
  return CoreReactiveInfiniteQueryTestHarness(args);
}
