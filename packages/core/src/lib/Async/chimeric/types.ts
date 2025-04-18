import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';

export type ChimericAsync<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
> = IdiomaticAsync<TParams, TResult> & ReactiveAsync<TParams, TResult, E>;

export type DefineChimericAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
