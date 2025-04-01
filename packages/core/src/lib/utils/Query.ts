import { ChimericQuery, IdiomaticQuery, ReactiveQuery } from '../types/Query';

export const fuseChimericQuery = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult>;
  reactive: ReactiveQuery<TParams, TResult, E>['useQuery'];
}): ChimericQuery<TParams, TResult, E> => {
  const chimericFn = createIdiomaticQuery(args.idiomatic) as ChimericQuery<
    TParams,
    TResult,
    E
  >;
  chimericFn.useQuery = createReactiveQuery(args.reactive).useQuery;
  return chimericFn;
};

export const createIdiomaticQuery = <TParams = void, TResult = unknown>(
  idiomaticQuery: IdiomaticQuery<TParams, TResult>,
): IdiomaticQuery<TParams, TResult> => {
  return idiomaticQuery;
};

export const createReactiveQuery = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveQuery: ReactiveQuery<TParams, TResult, E>['useQuery'],
): ReactiveQuery<TParams, TResult, E> => {
  return {
    useQuery: reactiveQuery,
  };
};
