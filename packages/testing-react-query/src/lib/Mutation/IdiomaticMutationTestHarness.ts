import { IdiomaticMutation } from '@chimeric/react-query';
import { IdiomaticMutationTestHarnessReturnType } from './types';
import { IdiomaticMutationTestHarness as CoreIdiomaticMutationTestHarness } from '@chimeric/testing-core';

// No params
export function IdiomaticMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<void, TResult, E>;
}): IdiomaticMutationTestHarnessReturnType<void, TResult, E>;

// Required params
export function IdiomaticMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<TParams, TResult, E>;
}): IdiomaticMutationTestHarnessReturnType<TParams, TResult, E>;

// Optional params
export function IdiomaticMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<TParams | undefined, TResult, E>;
}): IdiomaticMutationTestHarnessReturnType<TParams | undefined, TResult, E>;

// Implementation
export function IdiomaticMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticMutation: IdiomaticMutation<TParams, TResult, E>;
}): IdiomaticMutationTestHarnessReturnType<TParams, TResult, E> {
  return CoreIdiomaticMutationTestHarness(
    args,
  ) as IdiomaticMutationTestHarnessReturnType<TParams, TResult, E>;
}
