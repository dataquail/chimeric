import { isIdiomaticQuery as coreIsIdiomaticQuery } from '@chimeric/core';
import { IdiomaticQuery } from './types';

export function isIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(query: unknown): query is IdiomaticQuery<TParams, TResult, TError> {
  return coreIsIdiomaticQuery(query);
}
