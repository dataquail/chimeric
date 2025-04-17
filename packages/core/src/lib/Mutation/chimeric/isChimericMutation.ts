import { isIdiomaticMutation } from '../idiomatic/isIdiomaticMutation';
import { isReactiveMutation } from '../reactive/isReactiveMutation';
import { ChimericMutation } from './types';

export const isChimericMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericMutation: unknown,
): maybeChimericMutation is ChimericMutation<TParams, TResult, E> => {
  return (
    isIdiomaticMutation(maybeChimericMutation) &&
    isReactiveMutation(maybeChimericMutation)
  );
};
