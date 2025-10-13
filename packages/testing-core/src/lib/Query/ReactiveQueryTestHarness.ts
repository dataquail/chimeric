import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReactiveQueryTestHarnessReturnType } from './types.js';

// Required params
export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
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

// Optional params
export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
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

// No params
export function ReactiveQueryTestHarness<
  TResult = unknown,
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

// Implementation
export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
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
  params?: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, TError> {
  const { reactiveQuery, options, nativeOptions, wrapper, params } = args;
  const allOptions = {};
  if (options) {
    (allOptions as { options?: ReactiveQueryOptions }).options = options;
  }
  if (nativeOptions) {
    (allOptions as { nativeOptions?: TNativeOptions }).nativeOptions =
      nativeOptions;
  }
  const hookArgs =
    reactiveQuery.use.length === 1
      ? Object.keys(allOptions).length
        ? ([allOptions] as const)
        : []
      : Object.keys(allOptions).length
      ? ([params, allOptions] as const)
      : ([params] as const);
  const hook = renderHook(() => reactiveQuery.use(...(hookArgs as [any])), {
    wrapper,
  });
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
