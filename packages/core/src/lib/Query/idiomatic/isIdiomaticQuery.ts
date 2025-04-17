import { IdiomaticQuery } from './types';

export const isIdiomaticQuery = <TParams = void, TResult = unknown>(
  maybeIdiomaticQuery: unknown,
): maybeIdiomaticQuery is IdiomaticQuery<TParams, TResult> => {
  return typeof maybeIdiomaticQuery === 'function';
};
