import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarness } from './types.js';

export const ReactiveEagerAsyncTestHarness = <
  TParams = void,
  TResult = void,
  E extends Error = Error,
>({
  reactiveEagerAsync,
  params,
  wrapper,
}: {
  reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarness<TResult, E> => {
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
};
