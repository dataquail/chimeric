import {
  ChimericInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import {
  QueryKey,
  TanstackInfiniteQueryIdiomaticNativeOptions,
  TanstackInfiniteQueryReactiveNativeOptions,
  TanstackInfiniteQueryReactiveReturnType,
} from '@chimeric/react-query';
import {
  ChimericInfiniteQueryTestHarness as CoreChimericInfiniteQueryTestHarness,
  chimericMethods,
} from '@chimeric/testing-core';
import { ChimericInfiniteQueryTestHarnessReturnType } from './types';
import { JSX, ReactNode } from 'react';

export function ChimericInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(
  args: TParams extends void
    ? {
        chimericInfiniteQuery: ChimericInfiniteQuery<
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
        method: TMethod;
        reactiveOptions?: ReactiveInfiniteQueryOptions;
        reactiveNativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
        idiomaticOptions?: IdiomaticInfiniteQueryOptions<TPageParam>;
        idiomaticNativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        chimericInfiniteQuery: ChimericInfiniteQuery<
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
        method: TMethod;
        params: TParams;
        reactiveOptions?: ReactiveInfiniteQueryOptions;
        reactiveNativeOptions?: TanstackInfiniteQueryReactiveNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
        idiomaticOptions?: IdiomaticInfiniteQueryOptions<TPageParam>;
        idiomaticNativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): ChimericInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TMethod,
  TanstackInfiniteQueryReactiveReturnType<TPageData, TError, TPageParam>
> {
  return CoreChimericInfiniteQueryTestHarness(args);
}
