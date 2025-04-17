import { IdiomaticSync } from './types';

export const isIdiomaticSync = <TParams = void, TResult = unknown>(
  maybeIdiomaticSync: unknown,
): maybeIdiomaticSync is IdiomaticSync<TParams, TResult> => {
  return typeof maybeIdiomaticSync === 'function';
};
