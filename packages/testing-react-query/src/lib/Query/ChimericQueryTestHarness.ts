import {
  IdiomaticQueryOptions,
  ReactiveQueryOptions,
  ChimericQuery as CoreChimericQuery,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { ChimericQueryTestHarnessReturnType } from './types.js';
import {
  QueryKey,
  ChimericQuery,
  TanstackQueryIdiomaticNativeOptions,
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactiveReturnType,
} from '@chimeric/react-query';
import {
  chimericMethods,
  ChimericQueryTestHarness as CoreChimericQueryTestHarness,
} from '@chimeric/testing-core';

// Required params
export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<TParams, TResult, TError, TQueryKey>;
  method: TMethod;
  params: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, TError, TMethod>;

// Optional params
export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;
  method: TMethod;
  params?: NonNullable<TParams>;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, TError, TMethod>;

// No params
export function ChimericQueryTestHarness<
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<void, TResult, TError, TQueryKey>;
  method: TMethod;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, TError, TMethod>;

// Implementation
export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<TParams, TResult, TError, TQueryKey>;
  method: TMethod;
  params?: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, TError, TMethod> {
  return CoreChimericQueryTestHarness(
    args as {
      chimericQuery: CoreChimericQuery<
        TParams,
        TResult,
        TError,
        TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>,
        TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
        TanstackQueryReactiveReturnType<TResult, TError>
      >;
      method: (typeof chimericMethods)[number];
      params: TParams;
      reactiveOptions?: ReactiveQueryOptions;
      reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
      idiomaticOptions?: IdiomaticQueryOptions;
      idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
      wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
    },
  ) as ChimericQueryTestHarnessReturnType<TResult, TError, TMethod>;
}
