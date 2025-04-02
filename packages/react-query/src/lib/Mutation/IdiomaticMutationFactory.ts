import { Mutation, QueryClient } from '@tanstack/react-query';
import { createIdiomaticMutation, IdiomaticMutation } from '@chimeric/core';
import { MutationOptions } from '../types';

export const IdiomaticMutationFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: MutationOptions<TParams, TResult, E>,
): IdiomaticMutation<TParams, TResult> => {
  return createIdiomaticMutation(async (args) => {
    const mutationId = mutationOptions.mutationKey
      ? queryClient
          .getMutationCache()
          .find({ mutationKey: mutationOptions.mutationKey })?.mutationId ?? 0
      : 0;
    const mutation = new Mutation({
      mutationId,
      mutationCache: queryClient.getMutationCache(),
      options: mutationOptions,
    });
    return mutation.execute(args);
  });
};
