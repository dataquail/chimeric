import {
  ChimericQuery,
  IdiomaticQueryOptions,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { type ChimericMethod } from '../methods.js';
import { ChimericQueryTestHarnessReturnType } from './types.js';
import { IdiomaticQueryTestHarness } from './IdiomaticQueryTestHarness.js';
import { ReactiveQueryTestHarness } from './ReactiveQueryTestHarness.js';

// Required params (must come first - most specific)
export function ChimericQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericQuery: ChimericQuery<
    TParams,
    TResult,
    TError,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: ChimericMethod;
  params: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  ChimericMethod,
  TReactiveNativeReturnType
>;

// No params (must come before optional params)
export function ChimericQueryTestHarness<
  TResult,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericQuery: ChimericQuery<
    void,
    TResult,
    TError,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: ChimericMethod;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  ChimericMethod,
  TReactiveNativeReturnType
>;

// Optional params (must come last)
export function ChimericQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericQuery: ChimericQuery<
    TParams | undefined,
    TResult,
    TError,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: ChimericMethod;
  params?: TParams | undefined;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  ChimericMethod,
  TReactiveNativeReturnType
>;

// Implementation
export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>({
  chimericQuery,
  method,
  reactiveOptions,
  reactiveNativeOptions,
  idiomaticOptions,
  idiomaticNativeOptions,
  wrapper,
  params,
}: {
  chimericQuery: ChimericQuery<
    TParams | undefined,
    TResult,
    TError,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: ChimericMethod;
  params?: TParams | undefined;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  ChimericMethod,
  TReactiveNativeReturnType
> {
  if (method === 'idiomatic') {
    return IdiomaticQueryTestHarness({
      idiomaticQuery: chimericQuery,
      params,
      options: idiomaticOptions,
      nativeOptions: idiomaticNativeOptions,
    });
  } else {
    return ReactiveQueryTestHarness({
      reactiveQuery: chimericQuery,
      params,
      options: reactiveOptions,
      nativeOptions: reactiveNativeOptions,
      wrapper,
    });
  }
}
