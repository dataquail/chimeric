import { IdiomaticQuery } from './types';

export const isIdiomaticQuery = <
  TParams extends object | undefined,
  TResult = unknown,
>(
  maybeIdiomaticQuery: unknown,
): maybeIdiomaticQuery is IdiomaticQuery<TParams, TResult> => {
  return typeof maybeIdiomaticQuery === 'function';
};
