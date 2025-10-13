import { JSX, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactiveMutation, ReactiveMutationOptions } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { ReactiveMutationTestHarnessReturnType } from './types.js';

// Required params
export function ReactiveMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
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
    TNativeInvokeOptions,
    TNativeReturnType
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TNativeReactiveOptions;
}): ReactiveMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TNativeInvokeOptions,
  TNativeReturnType
>;

// Optional params
export function ReactiveMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>({
  reactiveMutation,
  wrapper,
  options,
  nativeOptions,
}: {
  reactiveMutation: ReactiveMutation<
    TParams | undefined,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TNativeReactiveOptions;
}): ReactiveMutationTestHarnessReturnType<
  TParams | undefined,
  TResult,
  E,
  TNativeInvokeOptions,
  TNativeReturnType
>;

// No params
export function ReactiveMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>({
  reactiveMutation,
  wrapper,
  options,
  nativeOptions,
}: {
  reactiveMutation: ReactiveMutation<
    void,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TNativeReactiveOptions;
}): ReactiveMutationTestHarnessReturnType<
  void,
  TResult,
  E,
  TNativeInvokeOptions,
  TNativeReturnType
>;

// Implementation
export function ReactiveMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
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
    TNativeInvokeOptions,
    TNativeReturnType
  >;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TNativeReactiveOptions;
}): ReactiveMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TNativeInvokeOptions,
  TNativeReturnType
> {
  const hook = renderHook(
    () => reactiveMutation.use({ options, nativeOptions }),
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
      TNativeInvokeOptions,
      TNativeReturnType
    >['result'],
  } as ReactiveMutationTestHarnessReturnType<
    TParams,
    TResult,
    E,
    TNativeInvokeOptions,
    TNativeReturnType
  >;
}
