import {
  ChimericQuery,
  IdiomaticQuery,
  IdiomaticQueryOptions,
  ReactiveQuery,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { ChimericQueryTestHarnessReturnType } from './types.js';
import { IdiomaticQueryTestHarness } from './IdiomaticQueryTestHarness.js';
import { ReactiveQueryTestHarness } from './ReactiveQueryTestHarness.js';

// Required params (must come first - most specific)
export function ChimericQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TMethod extends (typeof chimericMethods)[number] = (typeof chimericMethods)[number],
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
  method: TMethod;
  params: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  TMethod,
  TReactiveNativeReturnType
>;

// Optional params (must come before no params)
export function ChimericQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TMethod extends (typeof chimericMethods)[number] = (typeof chimericMethods)[number],
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
  method: TMethod;
  params?: TParams | undefined;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  TMethod,
  TReactiveNativeReturnType
>;

// No params (least specific - must come last)
export function ChimericQueryTestHarness<
  TResult,
  TError extends Error = Error,
  TMethod extends (typeof chimericMethods)[number] = (typeof chimericMethods)[number],
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
  method: TMethod;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  TMethod,
  TReactiveNativeReturnType
>;

// Implementation
export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
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
  method: TMethod;
  params?: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  TMethod,
  TReactiveNativeReturnType
> {
  const {
    chimericQuery,
    method,
    reactiveOptions,
    reactiveNativeOptions,
    idiomaticOptions,
    idiomaticNativeOptions,
    wrapper,
  } = args;
  if (method === 'idiomatic') {
    return IdiomaticQueryTestHarness({
      idiomaticQuery: chimericQuery as IdiomaticQuery<
        object,
        TResult,
        TIdiomaticNativeOptions
      >,
      params: (args as { params: object }).params,
      options: idiomaticOptions,
      nativeOptions: idiomaticNativeOptions,
    }) as ChimericQueryTestHarnessReturnType<
      TResult,
      TError,
      TMethod,
      TReactiveNativeReturnType
    >;
  } else {
    return ReactiveQueryTestHarness({
      reactiveQuery: chimericQuery as ReactiveQuery<
        object,
        TResult,
        TError,
        TReactiveNativeOptions,
        TReactiveNativeReturnType
      >,
      params: (args as { params: object }).params,
      options: reactiveOptions,
      nativeOptions: reactiveNativeOptions,
      wrapper,
    }) as ChimericQueryTestHarnessReturnType<
      TResult,
      TError,
      TMethod,
      TReactiveNativeReturnType
    >;
  }
}
