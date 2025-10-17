import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import {
  ReactiveInfiniteQuery,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReactiveInfiniteQueryTestHarnessReturnType } from './types.js';

// Required params
export function ReactiveInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  params: TParams;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TNativeReturnType
>;

// Optional params
export function ReactiveInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  params?: TParams | undefined;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TNativeReturnType
>;

// No params
export function ReactiveInfiniteQueryTestHarness<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TNativeReturnType
>;

// Implementation
export function ReactiveInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>({
  reactiveInfiniteQuery,
  params,
  options,
  nativeOptions,
  wrapper,
}: {
  reactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TNativeOptions,
    TNativeReturnType
  >;
  params?: TParams | undefined;
  options?: ReactiveInfiniteQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  TError,
  TNativeReturnType
> {
  const allOptions = {};
  if (options) {
    (allOptions as { options?: ReactiveInfiniteQueryOptions }).options =
      options;
  }
  if (nativeOptions) {
    (allOptions as { nativeOptions?: TNativeOptions }).nativeOptions =
      nativeOptions;
  }
  const hookArgs =
    reactiveInfiniteQuery.use.length === 1
      ? Object.keys(allOptions).length
        ? ([allOptions] as const)
        : []
      : Object.keys(allOptions).length
      ? ([params, allOptions] as const)
      : ([params] as const);
  const hook = renderHook(
    () => reactiveInfiniteQuery.use(...(hookArgs as [any])),
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
