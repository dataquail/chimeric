import { IdiomaticEagerAsync } from './types';

export const isIdiomaticEagerAsync = <
  TParams extends undefined | object,
  TResult = unknown,
>(
  maybeIdiomaticEagerAsync: unknown,
): maybeIdiomaticEagerAsync is IdiomaticEagerAsync<TParams, TResult> => {
  return typeof maybeIdiomaticEagerAsync === 'function';
};
