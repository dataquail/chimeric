import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

export type ChimericQuery<TParams, TResult, E extends Error> = IdiomaticQuery<
  TParams,
  TResult
> &
  ReactiveQuery<TParams, TResult, E>;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericQuery<Parameters<T>[0], Awaited<ReturnType<T>>, E>;
