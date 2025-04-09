import { IdiomaticAsync, ReactiveAsync, ChimericAsync } from '../types/Async';

export const fuseChimericAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, E>;
}): ChimericAsync<TParams, TResult, E> => {
  const chimericFn = args.idiomatic as ChimericAsync<TParams, TResult, E>;
  chimericFn.useAsync = args.reactive.useAsync;
  if (isChimericAsync<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric async');
  }
};

export const createIdiomaticAsync = <TParams = void, TResult = unknown>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticAsync<TParams, TResult>>,
): IdiomaticAsync<TParams, TResult> => {
  if (isIdiomaticAsync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic async');
  }
};

export const createReactiveAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveAsync<TParams, TResult, E>['useAsync']>,
): ReactiveAsync<TParams, TResult, E> => {
  const reactiveAsync = {
    useAsync: reactiveFn,
  };
  if (isReactiveAsync<TParams, TResult, E>(reactiveAsync)) {
    return reactiveAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive async');
  }
};

export const isIdiomaticAsync = <TParams = void, TResult = unknown>(
  maybeIdiomaticAsync: unknown,
): maybeIdiomaticAsync is IdiomaticAsync<TParams, TResult> => {
  return typeof maybeIdiomaticAsync === 'function';
};

export const isReactiveAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveAsync<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'useAsync' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveAsync<TParams, TResult, E>)
      .useAsync === 'function'
  );
};

export const isChimericAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericAsync<TParams, TResult, E> => {
  return (
    isIdiomaticAsync(maybeChimericAsync) && isReactiveAsync(maybeChimericAsync)
  );
};
