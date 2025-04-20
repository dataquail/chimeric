import { IdiomaticMutation } from './types';

export const isIdiomaticMutation = <
  TParams extends undefined | object,
  TResult = unknown,
>(
  maybeIdiomaticMutation: unknown,
): maybeIdiomaticMutation is IdiomaticMutation<TParams, TResult> => {
  return typeof maybeIdiomaticMutation === 'function';
};
