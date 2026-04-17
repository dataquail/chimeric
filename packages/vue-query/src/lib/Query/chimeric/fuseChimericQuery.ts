import {
  fuseChimericQuery as coreFuseChimericQuery,
  isIdiomaticQuery,
  markIdiomatic,
  markReactive,
  TYPE_MARKERS,
} from '@chimeric/core';
import { QueryKey } from '@tanstack/vue-query';
import { type ChimericQuery } from './types';
import { type IdiomaticQuery } from '../idiomatic/types';
import { type ReactiveQuery } from '../reactive/types';

// No params
export function fuseChimericQuery<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  idiomatic,
  reactive,
}: {
  idiomatic: IdiomaticQuery<void, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<void, TResult, TError, TQueryKey>;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Optional params
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  idiomatic,
  reactive,
}: {
  idiomatic: IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;
}): ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;

// Required params
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  idiomatic,
  reactive,
}: {
  idiomatic: IdiomaticQuery<TParams, TResult, TError, TQueryKey>;
  reactive: ReactiveQuery<TParams, TResult, TError, TQueryKey>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey>;

// Implementation
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  idiomatic,
  reactive,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idiomatic: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactive: any;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  if (!isIdiomaticQuery(idiomatic)) {
    throw new Error('idiomatic is not a valid idiomatic query');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chimericQuery = idiomatic as any;
  chimericQuery.useHook = reactive.useHook;
  chimericQuery.usePrefetchHook = reactive.usePrefetchHook;

  markIdiomatic(chimericQuery, TYPE_MARKERS.IDIOMATIC_QUERY);
  markReactive(chimericQuery, TYPE_MARKERS.REACTIVE_QUERY);

  return chimericQuery as ChimericQuery<TParams, TResult, TError, TQueryKey>;
}

// Export core fuse for compatibility
export { coreFuseChimericQuery };
