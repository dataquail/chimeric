import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { SyncTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function ReactiveSyncTestHarness<TParams, TResult>(args: {
  reactiveSync: ReactiveSync<TParams, TResult>;
  params: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult>;

// Optional params (must come before no params)
export function ReactiveSyncTestHarness<TParams, TResult>(args: {
  reactiveSync: ReactiveSync<TParams | undefined, TResult>;
  params?: TParams | undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult>;

// No params (least specific - must come last)
export function ReactiveSyncTestHarness<TResult>(args: {
  reactiveSync: ReactiveSync<void, TResult>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult>;

// Implementation
export function ReactiveSyncTestHarness<
  TParams = void,
  TResult = unknown,
>(args: {
  reactiveSync: ReactiveSync<TParams, TResult>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult> {
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
}
