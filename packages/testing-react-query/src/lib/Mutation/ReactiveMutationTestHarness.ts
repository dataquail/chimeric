import { JSX, ReactNode } from 'react';
import {
  ReactiveMutation,
  TanstackMutationReactiveNativeOptions,
} from '@chimeric/react-query';
import { ReactiveMutationTestHarnessReturnType } from './types';
import { ReactiveMutationOptions } from '@chimeric/core';
import { ReactiveMutationTestHarness as CoreReactiveMutationTestHarness } from '@chimeric/testing-core';

// Required params
export function ReactiveMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveMutation: ReactiveMutation<TParams, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TanstackMutationReactiveNativeOptions<TParams, TResult, E>;
}): ReactiveMutationTestHarnessReturnType<TParams, TResult, E>;

// Optional params
export function ReactiveMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveMutation: ReactiveMutation<TParams | undefined, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TanstackMutationReactiveNativeOptions<TParams, TResult, E>;
}): ReactiveMutationTestHarnessReturnType<TParams, TResult, E>;

// No params
export function ReactiveMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveMutation: ReactiveMutation<void, TResult, E>;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: ReactiveMutationOptions;
  nativeOptions?: TanstackMutationReactiveNativeOptions<void, TResult, E>;
}): ReactiveMutationTestHarnessReturnType<void, TResult, E>;

// Implementation
export function ReactiveMutationTestHarness<
  TParams = void,
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
