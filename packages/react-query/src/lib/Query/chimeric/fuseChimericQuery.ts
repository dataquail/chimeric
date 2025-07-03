import { fuseChimericQuery as coreFuseChimericQuery } from '@chimeric/core';
import { ChimericQuery } from './types';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';
import { QueryKey } from '@tanstack/react-query';

export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<TParams, TResult, TError, TQueryKey>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  return coreFuseChimericQuery(args);
}
