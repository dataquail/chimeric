import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import {
  TanstackQueryReactiveNativeOptions,
  QueryKey,
  TanstackQueryReactiveReturnType,
} from '@chimeric/react-query';
import { JSX, ReactNode } from 'react';
import { ReactiveQueryTestHarnessReturnType } from './types.js';
import { ReactiveQueryTestHarness as CoreReactiveQueryTestHarness } from '@chimeric/testing-core';

export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  args: TParams extends void
    ? {
        reactiveQuery: ReactiveQuery<
          TParams,
          TResult,
          TError,
          TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
          TanstackQueryReactiveReturnType<TResult, TError>
        >;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
        options?: ReactiveQueryOptions;
        nativeOptions?: TanstackQueryReactiveNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
      }
    : {
        reactiveQuery: ReactiveQuery<
          TParams,
          TResult,
          TError,
          TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
          TanstackQueryReactiveReturnType<TResult, TError>
        >;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
        params: TParams;
        options?: ReactiveQueryOptions;
        nativeOptions?: TanstackQueryReactiveNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
      },
): ReactiveQueryTestHarnessReturnType<TResult, TError> {
  return CoreReactiveQueryTestHarness(
    args,
  ) as ReactiveQueryTestHarnessReturnType<TResult, TError>;
}
