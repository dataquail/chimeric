import { IdiomaticQuery } from './types';
import { isIdiomaticQuery } from './isIdiomaticQuery';

export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticQuery<TParams, TResult, TNativeOptions>,
): IdiomaticQuery<TParams, TResult, TNativeOptions> {
  if (isIdiomaticQuery<TParams, TResult, TNativeOptions>(idiomaticFn)) {
    return idiomaticFn;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
}
