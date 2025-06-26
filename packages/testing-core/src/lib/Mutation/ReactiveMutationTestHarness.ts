import { JSX, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveMutation, ReactiveMutationOptions } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { ReactiveMutationTestHarnessReturnType } from './types.js';

export function ReactiveMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
>({
  reactiveMutation,
  wrapper,
  options,
  nativeOptions,
}: {
  reactiveMutation: ReactiveMutation<
    TParams,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReturnType
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TNativeReactiveOptions;
}): ReactiveMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TNativeCallOptions,
  TNativeReturnType
> {
  const hook = renderHook(
    () => reactiveMutation.useMutation({ options, nativeOptions }),
    {
      wrapper,
    },
  );
  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      await waitFor(cb, options);
    },
    result: hook.result as ReactiveMutationTestHarnessReturnType<
      void, // TParams is undefined for the first overload
      TResult,
      E,
      TNativeCallOptions,
      TNativeReturnType
    >['result'],
  } as ReactiveMutationTestHarnessReturnType<
    TParams,
    TResult,
    E,
    TNativeCallOptions,
    TNativeReturnType
  >;
}
