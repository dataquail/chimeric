import { isReactiveMutation as coreIsReactiveMutation } from '@chimeric/core';
import { ReactiveMutation } from './types';

export const isReactiveMutation = <
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveMutation: unknown,
): maybeReactiveMutation is ReactiveMutation<TParams, TResult, E> => {
  return coreIsReactiveMutation(maybeReactiveMutation);
};
