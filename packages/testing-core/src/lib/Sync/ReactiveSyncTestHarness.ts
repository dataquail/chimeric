import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { SyncTestHarnessReturnType } from './types.js';

export const ReactiveSyncTestHarness = <TParams = void, TResult = unknown>(
  args: TParams extends void | undefined
    ? {
        reactiveSync: ReactiveSync<TParams, TResult>;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        reactiveSync: ReactiveSync<TParams, TResult>;
        params: TParams;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): SyncTestHarnessReturnType<TResult> => {
  const { reactiveSync, wrapper } = args;
  const hook = renderHook(
    () => reactiveSync.use((args as { params?: TParams })?.params as TParams),
    { wrapper },
  );
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
