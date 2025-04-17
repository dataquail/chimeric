import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveAsyncOptions, ReactiveAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { AsyncTestHarnessType } from './types';

// Overloads
export function ReactiveAsyncTestHarness<
  TParams extends void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveAsync: ReactiveAsync<void, TResult, E>;
  reactiveOptions?: ReactiveAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessType<void, TResult, E>;
export function ReactiveAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveAsync: ReactiveAsync<TParams, TResult, E>;
  reactiveOptions?: ReactiveAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessType<TParams, TResult, E>;

// Implementation
export function ReactiveAsyncTestHarness<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>({
  reactiveAsync,
  reactiveOptions,
  wrapper,
}: {
  reactiveAsync: ReactiveAsync<TParams, TResult, E>;
  reactiveOptions?: ReactiveAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessType<TParams, TResult, E> {
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
    result: hook.result as AsyncTestHarnessType<TParams, TResult, E>['result'],
  };
}
