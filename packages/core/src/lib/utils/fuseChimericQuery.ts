import { ChimericQuery, IdiomaticQueryParams } from '../types/ChimericQuery';
import { IdiomaticAsyncFunction } from '../types/IdiomaticAsyncFunction';

export const fuseChimericQuery = <TParams, TResult, E extends Error>(args: {
  fn: IdiomaticAsyncFunction<IdiomaticQueryParams<TParams>, TResult>;
  useQuery: ChimericQuery<TParams, TResult, E>['useQuery'];
}): ChimericQuery<TParams, TResult, E> => {
  const chimericFn = args.fn as ChimericQuery<TParams, TResult, E>;
  chimericFn.useQuery = args.useQuery;
  return chimericFn;
};
