import { waitFor, renderHook } from '@testing-library/react';
import {
  ReactiveEagerAsync,
  ReactiveEagerAsyncOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// No params
export function ReactiveEagerAsyncTestHarness<
  TResult = unknown,
  TError extends Error = Error,
>({
  reactiveEagerAsync,
  reactiveOptions,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<void, TResult, TError>;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Optional params
export function ReactiveEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  reactiveEagerAsync,
  params,
  reactiveOptions,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams | undefined, TResult, TError>;
  params?: TParams;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Required params
export function ReactiveEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  reactiveEagerAsync,
  params,
  reactiveOptions,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError>;
  params: TParams;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Implementation
export function ReactiveEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  reactiveEagerAsync,
  params,
  reactiveOptions,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError>;
  params?: TParams;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError> {
  const hook = renderHook(
    () => {
      if (params !== undefined) {
        return (reactiveEagerAsync.use as (p: TParams, o?: ReactiveEagerAsyncOptions) => {
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: TError | null;
          data: TResult | undefined;
        })(params, reactiveOptions);
      } else {
        return (reactiveEagerAsync.use as (o?: ReactiveEagerAsyncOptions) => {
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: TError | null;
          data: TResult | undefined;
        })(reactiveOptions);
      }
    },
    {
      wrapper,
    },
  );
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitFor(cb, options);
    },
    result: hook.result,
  };
}
