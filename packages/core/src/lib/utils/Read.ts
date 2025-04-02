import { IdiomaticRead, ReactiveRead, ChimericRead } from '../types/Read';

export const fuseChimericRead = <TParams = void, TResult = unknown>(args: {
  idiomatic: IdiomaticRead<TParams, TResult>;
  reactive: ReactiveRead<TParams, TResult>['use'];
}): ChimericRead<TParams, TResult> => {
  const chimericFn = createIdiomaticRead(args.idiomatic) as ChimericRead<
    TParams,
    TResult
  >;
  chimericFn.use = createReactiveRead(args.reactive).use;
  return chimericFn;
};

export const createIdiomaticRead = <TParams = void, TResult = unknown>(
  idiomaticRead: IdiomaticRead<TParams, TResult>,
): IdiomaticRead<TParams, TResult> => {
  return idiomaticRead;
};

export const createReactiveRead = <TParams = void, TResult = unknown>(
  reactiveRead: ReactiveRead<TParams, TResult>['use'],
): ReactiveRead<TParams, TResult> => {
  return {
    use: reactiveRead,
  };
};
