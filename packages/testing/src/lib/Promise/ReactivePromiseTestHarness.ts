import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactivePromise } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { PromiseTestHarness } from './types.js';

export const ReactivePromiseTestHarness = <TParams, TResult, E extends Error>({
  reactivePromise,
  wrapper,
}: {
  reactivePromise: ReactivePromise<TParams, TResult, E>;
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
}): PromiseTestHarness<TParams, TResult, E> => {
  const hook = renderHook(() => reactivePromise.usePromise(), {
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
  };
};
