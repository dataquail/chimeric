import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

export type ChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
> = IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions> &
  ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult,
    TNativeReactivePrefetchOptions
  >;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
> = Parameters<T> extends []
  ? ChimericQuery<
      void,
      Awaited<ReturnType<T>>,
      E,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult,
      TNativeReactivePrefetchOptions
    >
  : ChimericQuery<
      Parameters<T>[0],
      Awaited<ReturnType<T>>,
      E,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult,
      TNativeReactivePrefetchOptions
    >;
