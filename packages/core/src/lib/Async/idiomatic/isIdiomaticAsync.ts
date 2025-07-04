import { IdiomaticAsync } from './types';

export const isIdiomaticAsync = <TParams = void, TResult = unknown>(
  maybeIdiomaticAsync: unknown,
): maybeIdiomaticAsync is IdiomaticAsync<TParams, TResult> => {
  return typeof maybeIdiomaticAsync === 'function';
};
