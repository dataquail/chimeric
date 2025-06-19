import { IdiomaticAsync } from './types';

export const isIdiomaticAsync = <TParams, TResult>(
  maybeIdiomaticAsync: unknown,
): maybeIdiomaticAsync is IdiomaticAsync<TParams, TResult> => {
  return typeof maybeIdiomaticAsync === 'function';
};
