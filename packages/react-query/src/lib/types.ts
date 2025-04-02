import { MutationOptions as TanstackMutationOptions } from '@tanstack/react-query';

export type MutationOptions<TParams, TResult, E extends Error> = {
  mutationFn: (args: TParams) => Promise<TResult>;
  mutationKey?: string[];
  onSuccess?: TanstackMutationOptions<TResult, E, TParams>['onSuccess'];
  onMutate?: TanstackMutationOptions<TResult, E, TParams>['onMutate'];
  onError?: TanstackMutationOptions<TResult, E, TParams>['onError'];
  onSettled?: TanstackMutationOptions<TResult, E, TParams>['onSettled'];
  retry?: TanstackMutationOptions<TResult, E, TParams>['retry'];
  retryDelay?: TanstackMutationOptions<TResult, E, TParams>['retryDelay'];
  networkMode?: TanstackMutationOptions<TResult, E, TParams>['networkMode'];
  gcTime?: TanstackMutationOptions<TResult, E, TParams>['gcTime'];
  meta?: TanstackMutationOptions<TResult, E, TParams>['meta'];
  scope?: TanstackMutationOptions<TResult, E, TParams>['scope'];
};

export type ReactiveMutationOptions<TParams, TResult, E extends Error> = Omit<
  MutationOptions<TParams, TResult, E>,
  'mutationFn'
>;
