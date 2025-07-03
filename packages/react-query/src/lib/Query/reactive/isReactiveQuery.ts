import { isReactiveQuery as coreIsReactiveQuery } from '@chimeric/core';
import { ReactiveQuery } from './types';

export function isReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(query: unknown): query is ReactiveQuery<TParams, TResult, TError> {
  return coreIsReactiveQuery(query);
}
