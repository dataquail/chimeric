import { isIdiomaticQuery as coreIsIdiomaticQuery } from '@chimeric/core';
import { IdiomaticQuery } from './types';

export function isIdiomaticQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(query: unknown): query is IdiomaticQuery<TParams, TResult, E> {
  return coreIsIdiomaticQuery(query);
}
