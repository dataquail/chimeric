import {
  type QueryClient,
  type MutationFunctionContext,
} from '@tanstack/svelte-query';
import { IdiomaticMutationFactory } from '../idiomatic/IdiomaticMutationFactory';
import { ReactiveMutationFactory } from '../reactive/ReactiveMutationFactory.svelte';
import { ChimericMutation } from './types';
import { fuseChimericMutation } from './fuseChimericMutation';
import { SvelteIdiomaticMutationNativeOptions } from '../idiomatic/types';

// Required params
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (
      params: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
  } & SvelteIdiomaticMutationNativeOptions<TParams, TResult, TError>,
): ChimericMutation<TParams, TResult, TError>;

// Optional params
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (
      params?: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
  } & SvelteIdiomaticMutationNativeOptions<TParams | undefined, TResult, TError>,
): ChimericMutation<TParams | undefined, TResult, TError>;

// No params
export function ChimericMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (context?: MutationFunctionContext) => Promise<TResult>;
  } & SvelteIdiomaticMutationNativeOptions<void, TResult, TError>,
): ChimericMutation<void, TResult, TError>;

// Implementation
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  queryClient,
  mutationFn,
  ...mutationOptions
}: {
  queryClient: QueryClient;
  mutationFn: (
    params: TParams,
    context?: MutationFunctionContext,
  ) => Promise<TResult>;
} & SvelteIdiomaticMutationNativeOptions<TParams, TResult, TError>): ChimericMutation<
  TParams,
  TResult,
  TError
> {
  return fuseChimericMutation({
    idiomatic: IdiomaticMutationFactory({
      queryClient,
      mutationFn,
      ...mutationOptions,
    }),
    reactive: ReactiveMutationFactory({ mutationFn, queryClient, ...mutationOptions }),
  });
}
