import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { isChimericMutation } from './isChimericMutation';
import { ChimericMutation } from './types';

// Overloads
export function fuseChimericMutation<
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<undefined, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    undefined,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  undefined,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeCallOptions,
  TNativeReactiveReturnType
>;
export function fuseChimericMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    TParams,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  TParams,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeCallOptions,
  TNativeReactiveReturnType
>;

// Implementation
export function fuseChimericMutation<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    TParams,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  TParams,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeCallOptions,
  TNativeReactiveReturnType
> {
  const chimericFn = args.idiomatic as ChimericMutation<
    TParams,
    TResult,
    E,
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
      E,
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
