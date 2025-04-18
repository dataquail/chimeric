import { IdiomaticQuery } from './types';

export const isIdiomaticQuery = <
  TParams extends void | object,
  TResult = unknown,
>(
  maybeIdiomaticQuery: unknown,
): maybeIdiomaticQuery is IdiomaticQuery<TParams, TResult> => {
  return typeof maybeIdiomaticQuery === 'function';
};
