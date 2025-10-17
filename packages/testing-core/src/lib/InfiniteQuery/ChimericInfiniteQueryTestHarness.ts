import {
  ChimericInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { ChimericInfiniteQueryTestHarnessReturnType } from './types.js';
import { IdiomaticInfiniteQueryTestHarness } from './IdiomaticInfiniteQueryTestHarness.js';
import { ReactiveInfiniteQueryTestHarness } from './ReactiveInfiniteQueryTestHarness.js';

// Required params
export function ChimericInfiniteQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TMethod extends (typeof chimericMethods)[number] = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericInfiniteQuery: ChimericInfiniteQuery<
    TParams,
    TResult,
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
}): ChimericInfiniteQueryTestHarnessReturnType<
  TResult,
  TPageParam,
  TError,
  TMethod,
  TReactiveNativeReturnType
>;

// Optional params
export function ChimericInfiniteQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TMethod extends (typeof chimericMethods)[number] = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericInfiniteQuery: ChimericInfiniteQuery<
    TParams | undefined,
    TResult,
    TPageParam,
    TError,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: TMethod;
  params?: TParams | undefined;
  reactiveOptions?: ReactiveInfiniteQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticInfiniteQueryOptions<TPageParam>;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericInfiniteQueryTestHarnessReturnType<
  TResult,
  TPageParam,
  TError,
  TMethod,
  TReactiveNativeReturnType
>;

// No params
export function ChimericInfiniteQueryTestHarness<
  TResult = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TMethod extends (typeof chimericMethods)[number] = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericInfiniteQuery: ChimericInfiniteQuery<
    void,
    TResult,
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
}): ChimericInfiniteQueryTestHarnessReturnType<
  TResult,
  TPageParam,
  TError,
  TMethod,
  TReactiveNativeReturnType
>;

// Implementation
export function ChimericInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericInfiniteQuery: ChimericInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: TMethod;
  params?: TParams | undefined;
  reactiveOptions?: ReactiveInfiniteQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticInfiniteQueryOptions<TPageParam>;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TMethod,
  TReactiveNativeReturnType
> {
  const {
    chimericInfiniteQuery,
    method,
    params,
    reactiveOptions,
    reactiveNativeOptions,
    idiomaticOptions,
    idiomaticNativeOptions,
    wrapper,
  } = args;
  if (method === 'idiomatic') {
    return IdiomaticInfiniteQueryTestHarness({
      idiomaticInfiniteQuery: chimericInfiniteQuery,
      params,
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
      reactiveInfiniteQuery: chimericInfiniteQuery,
      params,
      options: reactiveOptions,
      nativeOptions: reactiveNativeOptions,
      wrapper,
    });
  }
}
