import { IdiomaticAsync } from '../types/Async';
import { ChimericEagerAsync, ReactiveEagerAsync } from '../types/EagerAsync';
import { isIdiomaticAsync } from './Async';

export const fuseChimericEagerAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveEagerAsync<TParams, TResult, E>;
}): ChimericEagerAsync<TParams, TResult, E> => {
  const chimericFn = args.idiomatic as ChimericEagerAsync<TParams, TResult, E>;
  chimericFn.useEagerAsync = args.reactive.useEagerAsync;
  if (isChimericEagerAsync<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric eager async');
  }
};

export const createReactiveEagerAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveEagerAsync<TParams, TResult, E>['useEagerAsync']>,
): ReactiveEagerAsync<TParams, TResult, E> => {
  const reactiveEagerAsync = {
    useEagerAsync: reactiveFn,
  };
  if (isReactiveEagerAsync<TParams, TResult, E>(reactiveEagerAsync)) {
    return reactiveEagerAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive eager async');
  }
};

export const isReactiveEagerAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveEagerAsync<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'useEagerAsync' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveEagerAsync<TParams, TResult, E>)
      .useEagerAsync === 'function'
  );
};

export const isChimericEagerAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericEagerAsync<TParams, TResult, E> => {
  return (
    isIdiomaticAsync(maybeChimericAsync) &&
    isReactiveEagerAsync(maybeChimericAsync)
  );
};
