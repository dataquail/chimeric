import { isReactiveQuery as coreIsReactiveQuery } from '@chimeric/core';
import { ReactiveQuery } from './types';

export function isReactiveQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(query: unknown): query is ReactiveQuery<TParams, TResult, E> {
  return coreIsReactiveQuery(query);
}
