import { ChimericMutation } from '../types/ChimericMutation';
import { IdiomaticAsyncFunction } from '../types/IdiomaticAsyncFunction';

export const fuseChimericMutation = <TParams, TResult, E extends Error>(args: {
  fn: IdiomaticAsyncFunction<TParams, TResult>;
  useMutation: ChimericMutation<TParams, TResult, E>['useMutation'];
}): ChimericMutation<TParams, TResult, E> => {
  const chimericFn = args.fn as ChimericMutation<TParams, TResult, E>;
  chimericFn.useMutation = args.useMutation;
  return chimericFn;
};
