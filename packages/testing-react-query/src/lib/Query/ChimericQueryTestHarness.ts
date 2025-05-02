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

// Overloads
export function ChimericQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<undefined, TResult, E, TQueryKey>;
  method: TMethod;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    E,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    E,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, E, TMethod>;
export function ChimericQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<TParams, TResult, E, TQueryKey>;
  method: TMethod;
  params: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    E,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    E,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, E, TMethod>;

// Implementation
export function ChimericQueryTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  chimericQuery: ChimericQuery<TParams, TResult, E, TQueryKey>;
  method: TMethod;
  params?: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    E,
    TQueryKey
  >;
  idiomaticOptions?: IdiomaticQueryOptions;
  idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    E,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ChimericQueryTestHarnessReturnType<TResult, E, TMethod> {
  return CoreChimericQueryTestHarness(
    args as {
      chimericQuery: ChimericQuery<object, TResult, E, TQueryKey>;
      method: TMethod;
      params: object;
      reactiveOptions?: ReactiveQueryOptions;
      reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
        TResult,
        E,
        TQueryKey
      >;
      idiomaticOptions?: IdiomaticQueryOptions;
      /* eslint-disable @typescript-eslint/no-explicit-any */
      idiomaticNativeOptions?: any;
      wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
    },
  );
}
