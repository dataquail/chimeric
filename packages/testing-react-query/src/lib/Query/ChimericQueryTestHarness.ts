import { IdiomaticQueryOptions, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { ChimericQueryTestHarnessReturnType } from './types.js';
import {
  QueryKey,
  ChimericQuery,
  TanstackQueryIdiomaticNativeOptions,
  TanstackQueryReactiveNativeOptions,
} from '@chimeric/react-query';
import {
  chimericMethods,
  ChimericQueryTestHarness as CoreChimericQueryTestHarness,
} from '@chimeric/testing-core';

// Required params (must come first - most specific)
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

// Optional params (must come before no params)

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

// No params (least specific - must come last)
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
    args as any,
  ) as ChimericQueryTestHarnessReturnType<TResult, TError, TMethod>;
}
