import { ChimericRead } from '../types/ChimericRead';
import { IdiomaticFunction } from '../types/IdiomaticFunction';

export const fuseChimericRead = <TParams, TResult>(args: {
  fn: IdiomaticFunction<TParams, TResult>;
  use: ChimericRead<TParams, TResult>['use'];
}): ChimericRead<TParams, TResult> => {
  const chimericFn = args.fn as ChimericRead<TParams, TResult>;
  chimericFn.use = args.use;
  return chimericFn;
};
