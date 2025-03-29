import {
  Mutation,
  MutationOptions,
  QueryClient,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { ChimericMutation, fuseChimericMutation } from '@chimeric/core';

export const ChimericMutationFactory = <TParams, TResult, E extends Error>(
  queryClient: QueryClient,
  {
    mutationFn,
    mutationKey,
    onSuccess,
    onError,
    onMutate,
    onSettled,
    retry,
    retryDelay,
    networkMode,
    gcTime,
    meta,
    scope,
  }: {
    mutationFn: (args: TParams) => Promise<TResult>;
    mutationKey?: string[];
    onSuccess?: MutationOptions<TResult, E, TParams>['onSuccess'];
    onMutate?: MutationOptions<TResult, E, TParams>['onMutate'];
    onError?: MutationOptions<TResult, E, TParams>['onError'];
    onSettled?: MutationOptions<TResult, E, TParams>['onSettled'];
    retry?: MutationOptions<TResult, E, TParams>['retry'];
    retryDelay?: MutationOptions<TResult, E, TParams>['retryDelay'];
    networkMode?: MutationOptions<TResult, E, TParams>['networkMode'];
    gcTime?: MutationOptions<TResult, E, TParams>['gcTime'];
    meta?: MutationOptions<TResult, E, TParams>['meta'];
    scope?: MutationOptions<TResult, E, TParams>['scope'];
  },
): ChimericMutation<TParams, TResult, E> => {
  return fuseChimericMutation({
    fn: async (args) => {
      const mutationId = mutationKey
        ? queryClient.getMutationCache().find({ mutationKey })?.mutationId ?? 0
        : 0;
      const mutation = new Mutation({
        mutationId,
        mutationCache: queryClient.getMutationCache(),
        options: {
          mutationFn,
          mutationKey,
          onSuccess,
          onError,
          onMutate,
          onSettled,
          retry,
          retryDelay,
          networkMode,
          gcTime,
          meta,
          scope,
        },
      });
      return mutation.execute(args);
    },
    useMutation: (config?: {
      options: UseMutationOptions<TResult, E, TParams>;
    }) => {
      const mutation = useMutation<TResult, E, TParams, unknown>({
        mutationFn,
        mutationKey,
        onSuccess,
        onError,
        onMutate,
        onSettled,
        retry,
        retryDelay,
        networkMode,
        gcTime,
        meta,
        scope,
        ...(config?.options ?? {}),
      });

      return {
        call: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
      };
    },
  });
};
