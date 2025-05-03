import { fuseChimericQuery as coreFuseChimericQuery } from '@chimeric/core';
import { ChimericQuery } from './types';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';
import { QueryKey } from '@tanstack/react-query';

// Overloads
export function fuseChimericQuery<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<undefined, TResult, E, TQueryKey>;
  reactive: ReactiveQuery<undefined, TResult, E, TQueryKey>;
}): ChimericQuery<undefined, TResult, E, TQueryKey>;
export function fuseChimericQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, E, TQueryKey>;
  reactive: ReactiveQuery<TParams, TResult, E, TQueryKey>;
}): ChimericQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function fuseChimericQuery<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, E, TQueryKey>;
  reactive: ReactiveQuery<TParams, TResult, E, TQueryKey>;
}): ChimericQuery<TParams, TResult, E, TQueryKey> {
  return coreFuseChimericQuery(args) as ChimericQuery<
    TParams,
    TResult,
    E,
    TQueryKey
  >;
}
