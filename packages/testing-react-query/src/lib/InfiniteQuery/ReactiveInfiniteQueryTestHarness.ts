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

export function ReactiveInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  args: TParams extends void
    ? {
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
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
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
      },
): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
> {
  return CoreReactiveInfiniteQueryTestHarness(args);
}