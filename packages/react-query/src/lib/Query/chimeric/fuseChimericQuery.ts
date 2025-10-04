import { fuseChimericQuery as coreFuseChimericQuery } from '@chimeric/core';
import { ChimericQuery } from './types';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';
import { QueryKey } from '@tanstack/react-query';

// Overload for no params
export function fuseChimericQuery<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<void, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<void, TResult, TError, TQueryKey>;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Overload for optional params
export function fuseChimericQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;
}): ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;

// Overload for required params
export function fuseChimericQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<TParams, TResult, TError, TQueryKey>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey>;

// Implementation
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: any;
  reactive: any;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  return coreFuseChimericQuery(args) as ChimericQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
