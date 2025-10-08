import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReactiveQueryTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function ReactiveQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveQuery: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  params: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError>;

// No params (must come before optional params)
export function ReactiveQueryTestHarness<
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveQuery: ReactiveQuery<
    void,
    TResult,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError>;

// Optional params (must come last)
export function ReactiveQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveQuery: ReactiveQuery<
    TParams | undefined,
    TResult,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  params?: TParams | undefined;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError>;

// Implementation
export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>({
  reactiveQuery,
  options,
  nativeOptions,
  wrapper,
  params,
}: {
  reactiveQuery: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  params?: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError> {
  let allOptions:
    | {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }
    | undefined = {};

  if (!options && !nativeOptions) {
    allOptions = undefined;
  } else {
    if (options) {
      allOptions.options = options;
    }
    if (nativeOptions) {
      allOptions.nativeOptions = nativeOptions;
    }
  }

  const hookArgs =
    allOptions !== undefined
      ? [params, allOptions]
      : [params].filter((arg) => arg !== undefined);

  const hook = renderHook(
    () => reactiveQuery.use(...(hookArgs as [TParams, typeof allOptions])),
    { wrapper },
  );
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  };
}
