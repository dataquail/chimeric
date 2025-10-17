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
    TNativeReactiveResult
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
> = Parameters<T> extends []
  ? ChimericInfiniteQuery<
      void,
      TPageData,
      TPageParam,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult
    >
  : ChimericInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult
    >;
