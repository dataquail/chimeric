import {
  Mutation,
  type QueryClient,
  type MutationOptions,
} from '@tanstack/react-query';
import { IdiomaticMutation } from './types';
import { createIdiomaticMutation } from './createIdiomaticMutation';

// Overloads
export function IdiomaticMutationFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: () => Promise<TResult>;
  } & Omit<MutationOptions<TResult, E, undefined>, 'mutationFn'>,
): IdiomaticMutation<undefined, TResult>;
export function IdiomaticMutationFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>,
): IdiomaticMutation<TParams, TResult>;

// Implementation
export function IdiomaticMutationFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>,
): IdiomaticMutation<TParams, TResult> {
  console.log('mutationOptions', mutationOptions);
  const mutationId = mutationOptions.mutationKey
    ? queryClient
        .getMutationCache()
        .find({ mutationKey: mutationOptions.mutationKey })?.mutationId ?? 0
    : 0;
  const mutation = new Mutation({
    mutationId,
    mutationCache: queryClient.getMutationCache(),
    options: {
      ...(mutationOptions as MutationOptions<TResult, E, TParams>),
    },
  });
  return createIdiomaticMutation(async (idiomaticAndNativeOptions) => {
    const { options, nativeOptions, ...params } =
      idiomaticAndNativeOptions ?? {};
    mutation.setOptions({
      mutationFn: mutationOptions.mutationFn,
      ...(options ?? {}),
      ...((nativeOptions ?? {}) as Omit<
        MutationOptions<TResult, E, TParams>,
        'mutationFn'
      >),
    });
    return mutation.execute(params as TParams);
  }) as IdiomaticMutation<TParams, TResult>;
}
