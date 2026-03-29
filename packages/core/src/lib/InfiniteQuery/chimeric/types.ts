import { IdiomaticInfiniteQuery } from '../idiomatic/types';
import { ReactiveInfiniteQuery } from '../reactive/types';

export type ChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
> = IdiomaticInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TNativeIdiomaticOptions
> &
  ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult,
    TNativeReactivePrefetchOptions
  >;

export type DefineChimericInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
> = Parameters<T> extends []
  ? ChimericInfiniteQuery<
      void,
      TPageData,
      TPageParam,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult,
      TNativeReactivePrefetchOptions
    >
  : ChimericInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult,
      TNativeReactivePrefetchOptions
    >;
