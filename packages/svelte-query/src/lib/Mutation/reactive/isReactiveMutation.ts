import { isReactiveMutation as coreIsReactiveMutation } from '@chimeric/core';
import { ReactiveMutation } from './types';

export function isReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  mutation: ReactiveMutation<TParams, TResult, TError>,
): mutation is ReactiveMutation<TParams, TResult, TError> {
  return coreIsReactiveMutation(mutation);
}
