import { JSX, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveMutation } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { MutationTestHarness } from './types.js';

export const ReactiveMutationTestHarness = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  reactiveMutation,
  wrapper,
}: {
  reactiveMutation: ReactiveMutation<TParams, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): MutationTestHarness<TParams, TResult, E> => {
  const hook = renderHook(() => reactiveMutation.useMutation(), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      await waitFor(cb, options);
    },
    result: hook.result as MutationTestHarness<TParams, TResult, E>['result'],
  } as MutationTestHarness<TParams, TResult, E>;
};
