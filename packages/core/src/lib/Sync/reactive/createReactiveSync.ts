import { isReactiveSync } from './isReactiveSync';
import { ReactiveSync } from './types';

export const createReactiveSync = <TParams = undefined, TResult = unknown>(
  reactiveFn: (params: TParams) => TResult,
): ReactiveSync<TParams, TResult> => {
  const reactiveSync = {
    useSync: reactiveFn,
  };
  if (isReactiveSync<TParams, TResult>(reactiveSync)) {
    return reactiveSync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive sync');
  }
};
