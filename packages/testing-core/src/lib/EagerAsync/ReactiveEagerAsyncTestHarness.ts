import { waitFor, renderHook } from '@testing-library/react';
import { ReactiveEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

export function ReactiveEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  args: TParams extends void
    ? {
        reactiveEagerAsync: ReactiveEagerAsync<void, TResult, TError>;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError>;
        params: TParams;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): EagerAsyncTestHarnessReturnType<TResult, TError> {
  const { reactiveEagerAsync, wrapper } = args;
  const hook = renderHook(
    () =>
      reactiveEagerAsync.useEagerAsync(
        (args as { params?: TParams })?.params as TParams,
      ),
    {
      wrapper,
    },
  );
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitFor(cb, options);
    },
    result: hook.result,
  };
}
