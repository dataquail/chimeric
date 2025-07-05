import { ReactiveQuery } from './types';
import { isReactiveQuery } from './isReactiveQuery';

export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeReturnType
  >['use'],
): ReactiveQuery<TParams, TResult, TError, TNativeOptions, TNativeReturnType> {
  const reactiveQuery = {
    use: reactiveFn,
  };
  if (
    isReactiveQuery<
      TParams,
      TResult,
      TError,
      TNativeOptions,
      TNativeReturnType
    >(reactiveQuery)
  ) {
    return reactiveQuery;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
}
