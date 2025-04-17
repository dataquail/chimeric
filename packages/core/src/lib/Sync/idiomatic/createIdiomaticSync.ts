import { isIdiomaticSync } from './isIdiomaticSync';
import { IdiomaticSync } from './types';

export const createIdiomaticSync = <TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => TResult,
): IdiomaticSync<TParams, TResult> => {
  if (isIdiomaticSync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticSync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic sync');
  }
};
