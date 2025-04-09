import {
  ChimericMutation,
  IdiomaticMutation,
  ReactiveMutation,
} from '../types/Mutation';

export const fuseChimericMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult>;
  reactive: ReactiveMutation<TParams, TResult, E>;
}): ChimericMutation<TParams, TResult, E> => {
  const chimericFn = args.idiomatic as ChimericMutation<TParams, TResult, E>;
  chimericFn.useMutation = args.reactive.useMutation;
  if (isChimericMutation<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric mutation');
  }
};

export const createIdiomaticMutation = <TParams = void, TResult = unknown>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticMutation<TParams, TResult>>,
): IdiomaticMutation<TParams, TResult> => {
  if (isIdiomaticMutation<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticMutation<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic mutation');
  }
};

export const createReactiveMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveMutation<TParams, TResult, E>['useMutation']>,
): ReactiveMutation<TParams, TResult, E> => {
  const reactiveMutation = {
    useMutation: reactiveFn,
  };
  if (isReactiveMutation<TParams, TResult, E>(reactiveMutation)) {
    return reactiveMutation;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
};

export const isIdiomaticMutation = <TParams = void, TResult = unknown>(
  maybeIdiomaticMutation: unknown,
): maybeIdiomaticMutation is IdiomaticMutation<TParams, TResult> => {
  return typeof maybeIdiomaticMutation === 'function';
};

export const isReactiveMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveMutation: unknown,
): maybeReactiveMutation is ReactiveMutation<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveMutation === 'function' ||
      typeof maybeReactiveMutation === 'object') &&
    maybeReactiveMutation !== null &&
    'useMutation' in maybeReactiveMutation &&
    typeof (maybeReactiveMutation as ReactiveMutation<TParams, TResult, E>)
      .useMutation === 'function'
  );
};

export const isChimericMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericMutation: unknown,
): maybeChimericMutation is ChimericMutation<TParams, TResult, E> => {
  return (
    isIdiomaticMutation(maybeChimericMutation) &&
    isReactiveMutation(maybeChimericMutation)
  );
};
