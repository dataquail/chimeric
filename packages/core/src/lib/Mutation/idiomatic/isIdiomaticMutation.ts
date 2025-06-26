import { IdiomaticMutation } from './types';

export const isIdiomaticMutation = <
  TParams = void,
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
