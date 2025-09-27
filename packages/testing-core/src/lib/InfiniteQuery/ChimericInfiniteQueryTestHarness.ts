import {
  ChimericInfiniteQuery,
  IdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
  ReactiveInfiniteQuery,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { ChimericInfiniteQueryTestHarnessReturnType } from './types.js';
import { IdiomaticInfiniteQueryTestHarness } from './IdiomaticInfiniteQueryTestHarness.js';
import { ReactiveInfiniteQueryTestHarness } from './ReactiveInfiniteQueryTestHarness.js';

export function ChimericInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(
  args: TParams extends void
    ? {
        chimericInfiniteQuery: ChimericInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TError,
          TIdiomaticNativeOptions,
          TReactiveNativeOptions,
          TReactiveNativeReturnType
        >;
        method: TMethod;
        reactiveOptions?: ReactiveInfiniteQueryOptions;
        reactiveNativeOptions?: TReactiveNativeOptions;
        idiomaticOptions?: IdiomaticInfiniteQueryOptions<TPageParam>;
        idiomaticNativeOptions?: TIdiomaticNativeOptions;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        chimericInfiniteQuery: ChimericInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TError,
          TIdiomaticNativeOptions,
          TReactiveNativeOptions,
          TReactiveNativeReturnType
        >;
        method: TMethod;
        params: TParams;
        reactiveOptions?: ReactiveInfiniteQueryOptions;
        reactiveNativeOptions?: TReactiveNativeOptions;
        idiomaticOptions?: IdiomaticInfiniteQueryOptions<TPageParam>;
        idiomaticNativeOptions?: TIdiomaticNativeOptions;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): ChimericInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TMethod,
  TReactiveNativeReturnType
> {
  const {
    chimericInfiniteQuery,
    method,
    reactiveOptions,
    reactiveNativeOptions,
    idiomaticOptions,
    idiomaticNativeOptions,
    wrapper,
  } = args;
  if (method === 'idiomatic') {
    return IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: chimericInfiniteQuery as IdiomaticInfiniteQuery<
        object,
        TPageData,
        TPageParam,
        TIdiomaticNativeOptions
      >,
      params: (args as { params: object }).params,
      options: idiomaticOptions,
      nativeOptions: idiomaticNativeOptions,
    }) as ChimericInfiniteQueryTestHarnessReturnType<
      TPageData,
      TPageParam,
      TError,
      TMethod,
      TReactiveNativeReturnType
    >;
  } else {
    return ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery: chimericInfiniteQuery as ReactiveInfiniteQuery<
        object,
        TPageData,
        TPageParam,
        TError,
        TReactiveNativeOptions,
        TReactiveNativeReturnType
      >,
      params: (args as { params: object }).params,
      options: reactiveOptions,
      nativeOptions: reactiveNativeOptions,
      wrapper,
    }) as ChimericInfiniteQueryTestHarnessReturnType<
      TPageData,
      TPageParam,
      TError,
      TMethod,
      TReactiveNativeReturnType
    >;
  }
}