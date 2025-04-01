import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveRead } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReadTestHarness } from './types.js';

export const ReactiveReadTestHarness = <TParams, TResult>({
  reactiveRead,
  params,
  wrapper,
}: {
  reactiveRead: ReactiveRead<TParams, TResult>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReadTestHarness<TResult> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hook = renderHook(() => reactiveRead.use(params as any), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitFor(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  };
};
