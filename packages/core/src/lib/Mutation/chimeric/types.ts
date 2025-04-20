import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';

export type ChimericMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
> = IdiomaticMutation<TParams, TResult> & ReactiveMutation<TParams, TResult, E>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
