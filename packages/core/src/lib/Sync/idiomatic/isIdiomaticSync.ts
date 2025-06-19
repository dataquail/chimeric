import { IdiomaticSync } from './types';

export const isIdiomaticSync = <TParams, TResult>(
  maybeIdiomaticSync: unknown,
): maybeIdiomaticSync is IdiomaticSync<TParams, TResult> => {
  return typeof maybeIdiomaticSync === 'function';
};
