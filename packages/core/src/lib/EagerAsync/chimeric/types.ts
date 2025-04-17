import { IdiomaticEagerAsync } from 'src/lib/EagerAsync/idiomatic/types';
import { ReactiveEagerAsync } from 'src/lib/EagerAsync/reactive/types';

export type ChimericEagerAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
> = IdiomaticEagerAsync<TParams, TResult> &
  ReactiveEagerAsync<TParams, TResult, E>;

export type DefineChimericEagerAsync<
  T extends (
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericEagerAsync<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>,
  E
>;
