import { ChimericPromise } from '../types/ChimericPromise';
import { IdiomaticAsyncFunction } from '../types/IdiomaticAsyncFunction';

export const fuseChimericPromise = <TParams, TResult, E extends Error>(args: {
  fn: IdiomaticAsyncFunction<TParams, TResult>;
  usePromise: ChimericPromise<TParams, TResult, E>['usePromise'];
}): ChimericPromise<TParams, TResult, E> => {
  const chimericFn = args.fn as ChimericPromise<TParams, TResult, E>;
  chimericFn.usePromise = args.usePromise;
  return chimericFn;
};
