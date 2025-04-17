import { IdiomaticQuery } from './types';
import { isIdiomaticQuery } from './isIdiomaticQuery';

export const createIdiomaticQuery = <TParams = void, TResult = unknown>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticQuery<TParams, TResult>>,
): IdiomaticQuery<TParams, TResult> => {
  if (isIdiomaticQuery<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
};
