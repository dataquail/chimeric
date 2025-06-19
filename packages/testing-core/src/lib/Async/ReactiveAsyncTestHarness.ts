import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveAsyncOptions, ReactiveAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { AsyncTestHarnessReturnType } from './types';

export function ReactiveAsyncTestHarness<
  TParams,
  TResult,
  E extends Error = Error,
>({
  reactiveAsync,
  reactiveOptions,
  wrapper,
}: {
  reactiveAsync: ReactiveAsync<TParams, TResult, E>;
  reactiveOptions?: ReactiveAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams, TResult, E> {
  const hook = renderHook(() => reactiveAsync.useAsync(reactiveOptions ?? {}), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  } as AsyncTestHarnessReturnType<TParams, TResult, E>;
}
