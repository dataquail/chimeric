import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { isChimericMutation } from './isChimericMutation';
import { ChimericMutation } from './types';

// Overloads
export function fuseChimericMutation<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<void, TResult>;
  reactive: ReactiveMutation<void, TResult, E>;
}): ChimericMutation<void, TResult, E>;
export function fuseChimericMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult>;
  reactive: ReactiveMutation<TParams, TResult, E>;
}): ChimericMutation<TParams, TResult, E>;

// Implementation
export function fuseChimericMutation<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult>;
  reactive: ReactiveMutation<TParams, TResult, E>;
}): ChimericMutation<TParams, TResult, E> {
  const chimericFn = args.idiomatic as ChimericMutation<TParams, TResult, E>;
  chimericFn.useMutation = args.reactive.useMutation;
  if (isChimericMutation<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric mutation');
  }
}
