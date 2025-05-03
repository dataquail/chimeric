import { IdiomaticMutation } from '@chimeric/react-query';
import { IdiomaticMutationTestHarnessReturnType } from './types.js';
import { IdiomaticMutationTestHarness as CoreIdiomaticMutationTestHarness } from '@chimeric/testing-core';

// Overloads
export function IdiomaticMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<undefined, TResult>;
}): IdiomaticMutationTestHarnessReturnType<undefined, TResult, E>;
export function IdiomaticMutationTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<TParams, TResult>;
}): IdiomaticMutationTestHarnessReturnType<TParams, TResult, E>;

// Implementation
export function IdiomaticMutationTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<TParams, TResult>;
}): IdiomaticMutationTestHarnessReturnType<TParams, TResult, E>;
export function IdiomaticMutationTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<TParams, TResult>;
}): IdiomaticMutationTestHarnessReturnType<TParams, TResult, E> {
  return CoreIdiomaticMutationTestHarness(
    args,
  ) as IdiomaticMutationTestHarnessReturnType<TParams, TResult, E>;
}
