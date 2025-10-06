import { IdiomaticQuery } from './types';
import { QueryKey } from '@tanstack/react-query';
import { createIdiomaticQuery as coreCreateIdiomaticQuery } from '@chimeric/core';

export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: IdiomaticQuery<TParams, TResult, TError, TQueryKey>,
): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  return coreCreateIdiomaticQuery(idiomaticFn);
}
