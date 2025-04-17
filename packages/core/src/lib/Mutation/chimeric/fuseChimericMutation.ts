import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { isChimericMutation } from './isChimericMutation';
import { ChimericMutation } from './types';

export const fuseChimericMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult>;
  reactive: ReactiveMutation<TParams, TResult, E>;
}): ChimericMutation<TParams, TResult, E> => {
  const chimericFn = args.idiomatic as ChimericMutation<TParams, TResult, E>;
  chimericFn.useMutation = args.reactive.useMutation;
  if (isChimericMutation<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric mutation');
  }
};
