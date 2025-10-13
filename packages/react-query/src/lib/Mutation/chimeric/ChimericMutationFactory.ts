import { type QueryClient } from '@tanstack/react-query';
import { IdiomaticMutationFactory } from '../idiomatic/IdiomaticMutationFactory';
import { ReactiveMutationFactory } from '../reactive/ReactiveMutationFactory';
import { ChimericMutation } from './types';
import { fuseChimericMutation } from './fuseChimericMutation';
import { TanstackIdiomaticNativeOptions } from '../idiomatic/types';

// Required params
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (params: TParams) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams, TResult, TError>,
): ChimericMutation<TParams, TResult, TError>;

// Optional params
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (params?: TParams) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams | undefined, TResult, TError>,
): ChimericMutation<TParams | undefined, TResult, TError>;

// No params
export function ChimericMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: () => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<void, TResult, TError>,
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
  mutationFn: (params: TParams) => Promise<TResult>;
} & TanstackIdiomaticNativeOptions<TParams, TResult, TError>): ChimericMutation<
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
    reactive: ReactiveMutationFactory({ mutationFn, ...mutationOptions }),
  });
}
