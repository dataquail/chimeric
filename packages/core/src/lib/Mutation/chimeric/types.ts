import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';

export type ChimericMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions> &
  ReactiveMutation<
    TParams,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReturnType
  >;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = ChimericMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeCallOptions,
  TNativeReturnType
>;
