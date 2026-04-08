import { fuseChimericQuery as coreFuseChimericQuery } from '@chimeric/core';
import { ChimericQuery } from './types';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';
import { QueryKey } from '@tanstack/react-query';

// Overload for no params
export function fuseChimericQuery<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<void, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<void, TResult, TError, TQueryKey>;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Overload for optional params
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;
}): ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;

// Overload for required params
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idiomatic: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactive: any;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  const chimeric = coreFuseChimericQuery(args) as ChimericQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;

  if (args.reactive.useSuspenseHook) {
    Object.assign(chimeric, { useSuspenseHook: args.reactive.useSuspenseHook });
  }

  return chimeric;
}
