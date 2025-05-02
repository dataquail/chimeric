import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// Overloads
export function ReactiveEagerAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<undefined, TResult, E>;
  params?: undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, E>;
export function ReactiveEagerAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, E>;

// Implementation
export function ReactiveEagerAsyncTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>({
  reactiveEagerAsync,
  params,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, E> {
  const hook = renderHook(
    () => reactiveEagerAsync.useEagerAsync(params as object),
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
