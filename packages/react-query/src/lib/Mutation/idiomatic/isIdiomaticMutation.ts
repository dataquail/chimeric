import { isIdiomaticMutation as coreIsIdiomaticMutation } from '@chimeric/core';
import { IdiomaticMutation } from './types';

export function isIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(mutation: unknown): mutation is IdiomaticMutation<TParams, TResult, TError> {
  return coreIsIdiomaticMutation(mutation);
}
