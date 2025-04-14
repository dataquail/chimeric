import { ChimericQuery, IdiomaticQuery, ReactiveQuery } from '../types/Query';

export const fuseChimericQuery = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult>;
  reactive: ReactiveQuery<TParams, TResult, E>;
}): ChimericQuery<TParams, TResult, E> => {
  const chimericFn = args.idiomatic as ChimericQuery<TParams, TResult, E>;
  chimericFn.useQuery = args.reactive.useQuery;
  if (isChimericQuery<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric query');
  }
};

export const createIdiomaticQuery = <TParams = void, TResult = unknown>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticQuery<TParams, TResult>>,
): IdiomaticQuery<TParams, TResult> => {
  if (isIdiomaticQuery<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
};

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

export const isIdiomaticQuery = <TParams = void, TResult = unknown>(
  maybeIdiomaticQuery: unknown,
): maybeIdiomaticQuery is IdiomaticQuery<TParams, TResult> => {
  return typeof maybeIdiomaticQuery === 'function';
};

export const isReactiveQuery = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveQuery: unknown,
): maybeReactiveQuery is ReactiveQuery<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveQuery === 'function' ||
      typeof maybeReactiveQuery === 'object') &&
    maybeReactiveQuery !== null &&
    'useQuery' in maybeReactiveQuery &&
    typeof (maybeReactiveQuery as ReactiveQuery<TParams, TResult, E>)
      .useQuery === 'function'
  );
};

export const isChimericQuery = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericQuery: unknown,
): maybeChimericQuery is ChimericQuery<TParams, TResult, E> => {
  return (
    isIdiomaticQuery(maybeChimericQuery) && isReactiveQuery(maybeChimericQuery)
  );
};
