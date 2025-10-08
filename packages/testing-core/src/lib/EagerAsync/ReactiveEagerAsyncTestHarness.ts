import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function ReactiveEagerAsyncTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError>;
  params: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// No params (must come before optional params)
export function ReactiveEagerAsyncTestHarness<
  TResult,
  TError extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<void, TResult, TError>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Optional params (must come last)
export function ReactiveEagerAsyncTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams | undefined, TResult, TError>;
  params?: TParams | undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Implementation
export function ReactiveEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  params,
  reactiveEagerAsync,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError> {
  const hook = renderHook(() => reactiveEagerAsync.use(params as TParams), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitFor(cb, options);
    },
    result: hook.result,
  };
}
