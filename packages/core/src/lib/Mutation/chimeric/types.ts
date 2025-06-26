import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';

export type ChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions> &
  ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReturnType
  >;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = ChimericMutation<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeCallOptions,
  TNativeReturnType
>;
