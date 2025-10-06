import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

export type ChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
> = IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions> &
  ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
> = ChimericQuery<
  Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
  Awaited<ReturnType<T>>,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
>;
