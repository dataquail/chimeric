import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { SyncTestHarness } from './types .js';

export const ReactiveSyncTestHarness = <TParams = void, TResult = unknown>({
  reactiveSync,
  params,
  wrapper,
}: {
  reactiveSync: ReactiveSync<TParams, TResult>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarness<TResult> => {
  const hook = renderHook(() => reactiveSync.useSync(params as TParams), {
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
