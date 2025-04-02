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
  reactive: ReactiveMutation<TParams, TResult, E>['useMutation'];
}): ChimericMutation<TParams, TResult, E> => {
  const chimericFn = createIdiomaticMutation(
    args.idiomatic,
  ) as ChimericMutation<TParams, TResult, E>;
  chimericFn.useMutation = createReactiveMutation(args.reactive).useMutation;
  return chimericFn;
};

export const createIdiomaticMutation = <TParams = void, TResult = unknown>(
  idiomaticMutation: IdiomaticMutation<TParams, TResult>,
): IdiomaticMutation<TParams, TResult> => {
  return idiomaticMutation;
};

export const createReactiveMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveMutation: ReactiveMutation<TParams, TResult, E>['useMutation'],
): ReactiveMutation<TParams, TResult, E> => {
  return {
    useMutation: reactiveMutation,
  };
};
