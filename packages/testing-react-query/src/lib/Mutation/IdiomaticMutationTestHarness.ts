import { IdiomaticMutation } from '@chimeric/react-query';
import { IdiomaticMutationTestHarnessReturnType } from './types';
import { IdiomaticMutationTestHarness as CoreIdiomaticMutationTestHarness } from '@chimeric/testing-core';

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
