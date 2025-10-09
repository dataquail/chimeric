import { isIdiomaticQuery as coreIsIdiomaticQuery } from '@chimeric/core';
import { IdiomaticQuery } from './types';

export function isIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  query: IdiomaticQuery<TParams, TResult, TError>,
): query is IdiomaticQuery<TParams, TResult, TError> {
  return coreIsIdiomaticQuery(query);
}
