import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { isChimericMutation } from './isChimericMutation';
import { ChimericMutation } from './types';

export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeCallOptions,
  TNativeReactiveReturnType
> {
  const chimericFn = args.idiomatic as ChimericMutation<
    TParams,
    TResult,
    TError,
    TNativeIdiomaticOptions,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReactiveReturnType
  >;
  chimericFn.useMutation = args.reactive.useMutation;
  if (
    isChimericMutation<
      TParams,
      TResult,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeCallOptions,
      TNativeReactiveReturnType
    >(chimericFn)
  ) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric mutation');
  }
}
