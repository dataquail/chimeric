import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarness } from './types.js';

// Overloads
export function ReactiveEagerAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<void, TResult, E>;
  params?: void;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarness<TResult, E>;
export function ReactiveEagerAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarness<TResult, E>;

// Implementation
export function ReactiveEagerAsyncTestHarness<
  TParams extends void | object,
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
}): EagerAsyncTestHarness<TResult, E> {
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
