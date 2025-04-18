import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

export type ChimericQuery<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
> = IdiomaticQuery<TParams, TResult> & ReactiveQuery<TParams, TResult, E>;

export type DefineChimericQuery<
  T extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericQuery<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>,
  E
>;
