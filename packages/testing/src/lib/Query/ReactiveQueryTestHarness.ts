import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveQuery } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { QueryTestHarness } from './types.js';

export const ReactiveQueryTestHarness = <TParams, TResult, E extends Error>({
  reactiveQuery,
  params,
  wrapper,
}: {
  reactiveQuery: ReactiveQuery<TParams, TResult, E>;
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hook = renderHook(() => reactiveQuery.useQuery(params as any), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  };
};
