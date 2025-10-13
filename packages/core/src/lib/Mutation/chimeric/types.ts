import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';

export type ChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions> &
  ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = Parameters<T> extends []
  ? ChimericMutation<
      void,
      Awaited<ReturnType<T>>,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >
  : ChimericMutation<
      Parameters<T>[0],
      Awaited<ReturnType<T>>,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >;
