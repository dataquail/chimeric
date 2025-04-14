import {
  Mutation,
  QueryClient,
  MutationOptions as TanstackMutationOptions,
} from '@tanstack/react-query';
import { IdiomaticMutation, isIdiomaticMutation } from '@chimeric/core';
import { MutationOptions } from '../types';

export const IdiomaticMutationFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: MutationOptions<TParams, TResult, E>,
): IdiomaticMutation<TParams, TResult> => {
  const idiomaticMutation = async (args: TParams) => {
    const mutationId = mutationOptions.mutationKey
      ? queryClient
          .getMutationCache()
          .find({ mutationKey: mutationOptions.mutationKey })?.mutationId ?? 0
      : 0;
    const mutation = new Mutation({
      mutationId,
      mutationCache: queryClient.getMutationCache(),
      options: mutationOptions as TanstackMutationOptions<
        TResult,
        E,
        TParams,
        unknown
      >,
    });
    return mutation.execute(args);
  };

  if (isIdiomaticMutation<TParams, TResult>(idiomaticMutation)) {
    return idiomaticMutation;
  } else {
    throw new Error(
      'idiomaticMutation is not qualified to be idiomatic mutation',
    );
  }
};
