import { IdiomaticQuery, IdiomaticQueryOptions } from './types';
import { isIdiomaticQuery } from './isIdiomaticQuery';

// Overloads
export function createIdiomaticQuery<
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (params?: {
    options?: IdiomaticQueryOptions;
    nativeOptions?: TNativeOptions;
  }) => ReturnType<IdiomaticQuery<undefined, TResult, TNativeOptions>>,
): IdiomaticQuery<undefined, TResult, TNativeOptions>;
export function createIdiomaticQuery<
  TParams extends object,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReturnType<IdiomaticQuery<TParams, TResult, TNativeOptions>>,
): IdiomaticQuery<TParams, TResult, TNativeOptions>;

// Implementation
export function createIdiomaticQuery<
  TParams extends object | undefined,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReturnType<IdiomaticQuery<TParams, TResult, TNativeOptions>>,
): IdiomaticQuery<TParams, TResult, TNativeOptions> {
  if (isIdiomaticQuery<TParams, TResult, TNativeOptions>(idiomaticFn)) {
    return idiomaticFn;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
}
