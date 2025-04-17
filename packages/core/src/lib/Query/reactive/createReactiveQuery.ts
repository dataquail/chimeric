import { ReactiveQuery } from './types';
import { isReactiveQuery } from './isReactiveQuery';

export const createReactiveQuery = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveQuery<TParams, TResult, E>['useQuery']>,
): ReactiveQuery<TParams, TResult, E> => {
  const reactiveQuery = {
    useQuery: reactiveFn,
  };
  if (isReactiveQuery<TParams, TResult, E>(reactiveQuery)) {
    return reactiveQuery;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
};
