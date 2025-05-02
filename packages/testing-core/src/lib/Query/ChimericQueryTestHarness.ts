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

// Overloads
export function ChimericQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericQuery: ChimericQuery<
    undefined,
    TResult,
    E,
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
  E,
  TMethod,
  TReactiveNativeReturnType
>;
export function ChimericQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(args: {
  chimericQuery: ChimericQuery<
    TParams,
    TResult,
    E,
    TIdiomaticNativeOptions,
    TReactiveNativeOptions,
    TReactiveNativeReturnType
  >;
  method: TMethod;
  params: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TReactiveNativeOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TIdiomaticNativeOptions;
}): ChimericQueryTestHarnessReturnType<
  TResult,
  E,
  TMethod,
  TReactiveNativeReturnType
>;

// Implementation
export function ChimericQueryTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>({
  chimericQuery,
  method,
  params,
  reactiveOptions,
  reactiveNativeOptions,
  idiomaticOptions,
  idiomaticNativeOptions,
  wrapper,
}: {
  chimericQuery: ChimericQuery<
    TParams,
    TResult,
    E,
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
  E,
  TMethod,
  TReactiveNativeReturnType
> {
  if (method === 'idiomatic') {
    return IdiomaticQueryTestHarness({
      idiomaticQuery: chimericQuery as IdiomaticQuery<
        object,
        TResult,
        TIdiomaticNativeOptions
      >,
      params: params as object,
      options: idiomaticOptions,
      nativeOptions: idiomaticNativeOptions,
    }) as ChimericQueryTestHarnessReturnType<
      TResult,
      E,
      TMethod,
      TReactiveNativeReturnType
    >;
  } else {
    return ReactiveQueryTestHarness({
      reactiveQuery: chimericQuery as ReactiveQuery<
        object,
        TResult,
        E,
        TReactiveNativeOptions,
        TReactiveNativeReturnType
      >,
      params: params as object,
      options: reactiveOptions,
      nativeOptions: reactiveNativeOptions,
      wrapper,
    }) as ChimericQueryTestHarnessReturnType<
      TResult,
      E,
      TMethod,
      TReactiveNativeReturnType
    >;
  }
}
