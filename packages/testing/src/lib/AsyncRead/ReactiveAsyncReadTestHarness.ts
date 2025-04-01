import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveAsyncRead } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { AsyncReadTestHarness } from './types.js';

export const ReactiveAsyncReadTestHarness = <
  TParams,
  TResult,
  E extends Error,
>({
  reactiveAsyncRead,
  params,
  wrapper,
}: {
  reactiveAsyncRead: ReactiveAsyncRead<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncReadTestHarness<TResult, E> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hook = renderHook(() => reactiveAsyncRead.useAsync(params as any), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitFor(cb, options);
    },
    result: hook.result,
  };
};
