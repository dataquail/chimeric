import { isChimericQuery as coreIsChimericQuery } from '@chimeric/core';
import { ChimericQuery } from './types';

export function isChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  query: unknown,
): query is ChimericQuery<TParams, TResult, TError> {
  return coreIsChimericQuery(query);
}
