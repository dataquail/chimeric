import { IdiomaticEagerAsync } from './types';

export const isIdiomaticEagerAsync = <TParams, TResult>(
  maybeIdiomaticEagerAsync: unknown,
): maybeIdiomaticEagerAsync is IdiomaticEagerAsync<TParams, TResult> => {
  return typeof maybeIdiomaticEagerAsync === 'function';
};
