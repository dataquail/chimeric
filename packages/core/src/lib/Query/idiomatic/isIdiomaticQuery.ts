import { IdiomaticQuery } from './types';

export const isIdiomaticQuery = <
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  maybeIdiomaticQuery: unknown,
): maybeIdiomaticQuery is IdiomaticQuery<TParams, TResult, TNativeOptions> => {
  return typeof maybeIdiomaticQuery === 'function';
};
