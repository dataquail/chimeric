import { isReactiveSync } from './isReactiveSync';
import { ReactiveSync } from './types';

export const createReactiveSync = <TParams = void, TResult = unknown>(
  reactiveFn: (params: TParams) => TResult,
): ReactiveSync<TParams, TResult> => {
  const reactiveSync = {
    use: reactiveFn,
  };
  if (isReactiveSync<TParams, TResult>(reactiveSync)) {
    return reactiveSync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive sync');
  }
};
