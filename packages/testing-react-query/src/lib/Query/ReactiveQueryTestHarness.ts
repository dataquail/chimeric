import { ReactiveQueryOptions } from '@chimeric/core';
import {
  ReactiveQuery,
  TanstackQueryReactiveNativeOptions,
  QueryKey,
} from '@chimeric/react-query';
import { JSX, ReactNode } from 'react';
import { ReactiveQueryTestHarnessReturnType } from './types.js';
import { ReactiveQueryTestHarness as CoreReactiveQueryTestHarness } from '@chimeric/testing-core';

// Overloads
export function ReactiveQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<undefined, TResult, E, TQueryKey>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<TResult, E>;
}): ReactiveQueryTestHarnessReturnType<TResult, E>;
export function ReactiveQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<TParams, TResult, E, TQueryKey>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  params: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<TResult, E>;
}): ReactiveQueryTestHarnessReturnType<TResult, E>;

// Implementation
export function ReactiveQueryTestHarness<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  reactiveQuery: ReactiveQuery<TParams, TResult, E, TQueryKey>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  params?: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<TResult, E>;
}): ReactiveQueryTestHarnessReturnType<TResult, E> {
  return CoreReactiveQueryTestHarness(
    args as {
      reactiveQuery: ReactiveQuery<undefined, TResult, E, readonly unknown[]>;
      wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      options?: ReactiveQueryOptions;
      nativeOptions?: TanstackQueryReactiveNativeOptions<TResult, E>;
    },
  ) as ReactiveQueryTestHarnessReturnType<TResult, E>;
}
