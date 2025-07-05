import { createReactiveMutation as coreCreateReactiveMutation } from '@chimeric/core';
import { type ReactiveMutation } from './types';

export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveMutation<TParams, TResult, TError>['use'],
): ReactiveMutation<TParams, TResult, TError> {
  return coreCreateReactiveMutation(reactiveFn);
}
