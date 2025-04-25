import {
  type MutationOptions,
  type QueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { IdiomaticMutationFactory } from '../idiomatic/IdiomaticMutationFactory';
import { ReactiveMutationFactory } from '../reactive/ReactiveMutationFactory';
import { ChimericMutation } from './types';
import { fuseChimericMutation } from './fuseChimericMutation';

// Overloads
export function ChimericMutationFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: () => Promise<TResult>;
  } & Omit<MutationOptions<TResult, E, undefined>, 'mutationFn'>,
): ChimericMutation<undefined, TResult, E>;
export function ChimericMutationFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>,
): ChimericMutation<TParams, TResult, E>;

// Implementation
export function ChimericMutationFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>,
): ChimericMutation<TParams, TResult, E> {
  return fuseChimericMutation({
    idiomatic: IdiomaticMutationFactory(
      queryClient,
      mutationOptions as {
        mutationFn: () => Promise<TResult>;
      } & Omit<MutationOptions<TResult, E, undefined>, 'mutationFn'>,
    ),
    reactive: ReactiveMutationFactory(
      mutationOptions as {
        mutationFn: () => Promise<TResult>;
      } & Omit<UseMutationOptions<TResult, E, undefined>, 'mutationFn'>,
    ),
  }) as ChimericMutation<TParams, TResult, E>;
}
