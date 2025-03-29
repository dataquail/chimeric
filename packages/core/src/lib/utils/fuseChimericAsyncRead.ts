import { ChimericAsyncRead } from '../types/ChimericAsyncRead';
import { IdiomaticAsyncFunction } from '../types/IdiomaticAsyncFunction';

export const fuseChimericAsyncRead = <TParams, TResult, E extends Error>(args: {
  fn: IdiomaticAsyncFunction<TParams, TResult>;
  useAsync: ChimericAsyncRead<TParams, TResult, E>['useAsync'];
}): ChimericAsyncRead<TParams, TResult, E> => {
  const chimericFn = args.fn as ChimericAsyncRead<TParams, TResult, E>;
  chimericFn.useAsync = args.useAsync;
  return chimericFn;
};
