import { IdiomaticMutation } from './types';

export const isIdiomaticMutation = <TParams = void, TResult = unknown>(
  maybeIdiomaticMutation: unknown,
): maybeIdiomaticMutation is IdiomaticMutation<TParams, TResult> => {
  return typeof maybeIdiomaticMutation === 'function';
};
