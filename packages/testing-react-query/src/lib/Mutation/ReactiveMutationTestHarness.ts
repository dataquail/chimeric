import { JSX, ReactNode } from 'react';
import {
  ReactiveMutation,
  TanstackMutationReactiveNativeOptions,
} from '@chimeric/react-query';
import { ReactiveMutationTestHarnessReturnType } from './types';
import { ReactiveMutationOptions } from '@chimeric/core';
import { ReactiveMutationTestHarness as CoreReactiveMutationTestHarness } from '@chimeric/testing-core';

// Overloads
export function ReactiveMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveMutation: ReactiveMutation<undefined, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TanstackMutationReactiveNativeOptions<undefined, TResult, E>;
}): ReactiveMutationTestHarnessReturnType<undefined, TResult, E>;
export function ReactiveMutationTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveMutation: ReactiveMutation<TParams, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TanstackMutationReactiveNativeOptions<TParams, TResult, E>;
}): ReactiveMutationTestHarnessReturnType<TParams, TResult, E>;

export function ReactiveMutationTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveMutation: ReactiveMutation<TParams, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TanstackMutationReactiveNativeOptions<TParams, TResult, E>;
}): ReactiveMutationTestHarnessReturnType<TParams, TResult, E> {
  return CoreReactiveMutationTestHarness(
    args,
  ) as ReactiveMutationTestHarnessReturnType<TParams, TResult, E>;
}
