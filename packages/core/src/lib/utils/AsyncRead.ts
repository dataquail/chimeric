import {
  ChimericAsyncRead,
  IdiomaticAsyncRead,
  ReactiveAsyncRead,
} from '../types/AsyncRead';

export const fuseChimericAsyncRead = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsyncRead<TParams, TResult>;
  reactive: ReactiveAsyncRead<TParams, TResult, E>['useAsync'];
}): ChimericAsyncRead<TParams, TResult, E> => {
  const chimericFn = createIdiomaticAsyncRead(
    args.idiomatic,
  ) as ChimericAsyncRead<TParams, TResult, E>;
  chimericFn.useAsync = createReactiveAsyncRead(args.reactive).useAsync;
  return chimericFn;
};

export const createIdiomaticAsyncRead = <TParams = void, TResult = unknown>(
  idiomaticAsyncRead: IdiomaticAsyncRead<TParams, TResult>,
): IdiomaticAsyncRead<TParams, TResult> => {
  return idiomaticAsyncRead;
};

export const createReactiveAsyncRead = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveAsyncRead: ReactiveAsyncRead<TParams, TResult, E>['useAsync'],
): ReactiveAsyncRead<TParams, TResult, E> => {
  return {
    useAsync: reactiveAsyncRead,
  };
};
