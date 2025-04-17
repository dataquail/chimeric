import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';

export type ChimericAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
> = IdiomaticAsync<TParams, TResult> & ReactiveAsync<TParams, TResult, E>;

export type DefineChimericAsync<
  T extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericAsync<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>,
  E
>;
