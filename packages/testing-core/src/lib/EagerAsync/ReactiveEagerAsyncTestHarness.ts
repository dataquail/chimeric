import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

export function ReactiveEagerAsyncTestHarness<
  TParams,
  TResult,
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
    () => reactiveEagerAsync.useEagerAsync(params as TParams),
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
