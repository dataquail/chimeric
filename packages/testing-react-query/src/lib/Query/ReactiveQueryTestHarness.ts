import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import {
  TanstackQueryReactiveNativeOptions,
  QueryKey,
  TanstackQueryReactiveReturnType,
} from '@chimeric/react-query';
import { JSX, ReactNode } from 'react';
import { ReactiveQueryTestHarnessReturnType } from './types.js';
import { ReactiveQueryTestHarness as CoreReactiveQueryTestHarness } from '@chimeric/testing-core';

// Required params
export function ReactiveQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
    TanstackQueryReactiveReturnType<TResult, TError>
  >;
  params: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError>;

// Optional params
export function ReactiveQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<
    TParams | undefined,
    TResult,
    TError,
    TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
    TanstackQueryReactiveReturnType<TResult, TError>
  >;
  params?: NonNullable<TParams>;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError>;

// No params
export function ReactiveQueryTestHarness<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<
    void,
    TResult,
    TError,
    TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
    TanstackQueryReactiveReturnType<TResult, TError>
  >;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError>;

// Implementation
export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
    TanstackQueryReactiveReturnType<TResult, TError>
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  params?: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
}): ReactiveQueryTestHarnessReturnType<TResult, TError> {
  return CoreReactiveQueryTestHarness(
    args as {
      reactiveQuery: ReactiveQuery<
        TParams,
        TResult,
        TError,
        TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
        TanstackQueryReactiveReturnType<TResult, TError>
      >;
      params: TParams;
      options?: ReactiveQueryOptions;
      nativeOptions?: TanstackQueryReactiveNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
      wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
    },
  ) as ReactiveQueryTestHarnessReturnType<TResult, TError>;
}
