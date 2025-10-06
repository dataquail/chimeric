import {
  ChimericQuery,
  // IdiomaticQuery,
  IdiomaticQueryOptions,
  // ReactiveQuery,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { ChimericQueryTestHarnessReturnType } from './types.js';
import { IdiomaticQueryTestHarness } from './IdiomaticQueryTestHarness.js';
import { ReactiveQueryTestHarness } from './ReactiveQueryTestHarness.js';

export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TReactiveNativeOptions = unknown,
  TReactiveNativeReturnType = unknown,
>(
  args: TParams extends void
    ? {
        chimericQuery: ChimericQuery<
          TParams,
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
      }
    : {
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
      },
): ChimericQueryTestHarnessReturnType<
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
      idiomaticQuery: chimericQuery as any,
      params: (args as { params: TParams }).params as any,
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
      reactiveQuery: chimericQuery as any,
      params: (args as { params: TParams }).params as any,
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
