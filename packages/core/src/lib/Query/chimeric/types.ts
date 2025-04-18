import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

export type ChimericQuery<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
> = IdiomaticQuery<TParams, TResult> & ReactiveQuery<TParams, TResult, E>;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericQuery<
  Parameters<T>[0] extends object | undefined ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
