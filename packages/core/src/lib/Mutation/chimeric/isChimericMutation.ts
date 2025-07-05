import { isIdiomaticMutation } from '../idiomatic/isIdiomaticMutation';
import { isReactiveMutation } from '../reactive/isReactiveMutation';
import { ChimericMutation } from './types';

export const isChimericMutation = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(
  maybeChimericMutation: unknown,
): maybeChimericMutation is ChimericMutation<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReactiveReturnType
> => {
  return (
    isIdiomaticMutation(maybeChimericMutation) &&
    isReactiveMutation(maybeChimericMutation)
  );
};
