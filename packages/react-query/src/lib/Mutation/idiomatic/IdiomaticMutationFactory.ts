import { type QueryClient, type MutationOptions } from '@tanstack/react-query';
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
  const mutation = queryClient
    .getMutationCache()
    .build(queryClient, mutationOptions);
  return createIdiomaticMutation(async (idiomaticAndNativeOptions) => {
    const { options, nativeOptions, ...params } =
      idiomaticAndNativeOptions ?? {};
    mutation.setOptions({
      ...mutationOptions,
      ...(options ?? {}),
      ...((nativeOptions ?? {}) as Omit<
        MutationOptions<TResult, E, TParams>,
        'mutationFn'
      >),
    });
    return mutation.execute(params as TParams);
  }) as IdiomaticMutation<TParams, TResult>;
}
