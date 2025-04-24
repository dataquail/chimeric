import { isIdiomaticMutation } from './isIdiomaticMutation';
import { IdiomaticMutation, IdiomaticMutationOptions } from './types';

// Overloads
export function createIdiomaticMutation<
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (params?: {
    options?: IdiomaticMutationOptions;
    nativeOptions?: TNativeOptions;
  }) => Promise<TResult>,
): IdiomaticMutation<undefined, TResult, TNativeOptions>;
export function createIdiomaticMutation<
  TParams extends object,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticMutationOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<TResult>,
): IdiomaticMutation<TParams, TResult, TNativeOptions>;

// Implementation
export function createIdiomaticMutation<
  TParams extends undefined | object,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticMutationOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReturnType<IdiomaticMutation<TParams, TResult, TNativeOptions>>,
): IdiomaticMutation<TParams, TResult, TNativeOptions> {
  if (isIdiomaticMutation<TParams, TResult, TNativeOptions>(idiomaticFn)) {
    return idiomaticFn as IdiomaticMutation<TParams, TResult, TNativeOptions>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic mutation');
  }
}
