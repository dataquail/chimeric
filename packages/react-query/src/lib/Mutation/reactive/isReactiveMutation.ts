import { isReactiveMutation as coreIsReactiveMutation } from '@chimeric/core';
import { ReactiveMutation } from './types';

export const isReactiveMutation = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeReactiveMutation: ReactiveMutation<TParams, TResult, TError>,
): maybeReactiveMutation is ReactiveMutation<TParams, TResult, TError> => {
  return coreIsReactiveMutation(maybeReactiveMutation);
};
