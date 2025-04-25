import { isIdiomaticMutation as coreIsIdiomaticMutation } from '@chimeric/core';
import { IdiomaticMutation } from './types';

export function isIdiomaticMutation<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(mutation: unknown): mutation is IdiomaticMutation<TParams, TResult, E> {
  return coreIsIdiomaticMutation(mutation);
}
