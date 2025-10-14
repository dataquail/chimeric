import { IdiomaticEagerAsync } from 'src/lib/EagerAsync/idiomatic/types';
import { ReactiveEagerAsync } from 'src/lib/EagerAsync/reactive/types';

export type ChimericEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = IdiomaticEagerAsync<TParams, TResult> &
  ReactiveEagerAsync<TParams, TResult, TError>;

export type DefineChimericEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ChimericEagerAsync<void, Awaited<ReturnType<T>>, TError>
  : ChimericEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
