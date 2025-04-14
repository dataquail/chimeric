import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveAsyncOptions, ReactiveAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { AsyncTestHarness } from './types.js';

export const ReactiveAsyncTestHarness = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  reactiveAsync,
  params,
  wrapper,
}: {
  reactiveAsync: ReactiveAsync<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarness<TParams, TResult, E> => {
  const hook = renderHook(
    () =>
      reactiveAsync.useAsync(
        params as { options: ReactiveAsyncOptions } & TParams & {
            options?: ReactiveAsyncOptions;
          },
      ),
    { wrapper },
  );
  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  } as AsyncTestHarness<TParams, TResult, E>;
};
