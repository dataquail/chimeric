import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveAsyncOptions, ReactiveAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { AsyncTestHarnessReturnType } from './types';

export function ReactiveAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  reactiveAsync,
  reactiveOptions,
  wrapper,
}: {
  reactiveAsync: ReactiveAsync<TParams, TResult, TError>;
  reactiveOptions?: ReactiveAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams, TResult, TError> {
  const hook = renderHook(() => reactiveAsync.use(reactiveOptions ?? {}), {
    wrapper,
  });

  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result as AsyncTestHarnessReturnType<
      TParams,
      TResult,
      TError
    >['result'],
  } as AsyncTestHarnessReturnType<TParams, TResult, TError>;
}
