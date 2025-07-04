import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';

export type ChimericAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = IdiomaticAsync<TParams, TResult> & ReactiveAsync<TParams, TResult, TError>;

export type DefineChimericAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = ChimericAsync<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError
>;
