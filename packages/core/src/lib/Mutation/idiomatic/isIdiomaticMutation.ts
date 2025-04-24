import { IdiomaticMutation } from './types';

export const isIdiomaticMutation = <
  TParams extends undefined | object,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  maybeIdiomaticMutation: unknown,
): maybeIdiomaticMutation is IdiomaticMutation<
  TParams,
  TResult,
  TNativeOptions
> => {
  return typeof maybeIdiomaticMutation === 'function';
};
