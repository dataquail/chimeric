import {
  ChimericPromise,
  IdiomaticPromise,
  ReactivePromise,
} from '../types/Promise';

export const fuseChimericPromise = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticPromise<TParams, TResult>;
  reactive: ReactivePromise<TParams, TResult, E>['usePromise'];
}): ChimericPromise<TParams, TResult, E> => {
  const chimericFn = createIdiomaticPromise(args.idiomatic) as ChimericPromise<
    TParams,
    TResult,
    E
  >;
  chimericFn.usePromise = createReactivePromise(args.reactive).usePromise;
  return chimericFn;
};

export const createIdiomaticPromise = <TParams = void, TResult = unknown>(
  idiomaticPromise: IdiomaticPromise<TParams, TResult>,
): IdiomaticPromise<TParams, TResult> => {
  return idiomaticPromise;
};

export const createReactivePromise = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactivePromise: ReactivePromise<TParams, TResult, E>['usePromise'],
): ReactivePromise<TParams, TResult, E> => {
  return {
    usePromise: reactivePromise,
  };
};
