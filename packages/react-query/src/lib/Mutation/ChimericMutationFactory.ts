import { QueryClient } from '@tanstack/react-query';
import { ChimericMutation, fuseChimericMutation } from '@chimeric/core';
import { MutationOptions } from '../types';
import { IdiomaticMutationFactory } from './IdiomaticMutationFactory';
import { ReactiveMutationFactory } from './ReactiveMutationFactory';

export const ChimericMutationFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: MutationOptions<TParams, TResult, E>,
): ChimericMutation<TParams, TResult, E> => {
  return fuseChimericMutation({
    idiomatic: IdiomaticMutationFactory(queryClient, mutationOptions),
    reactive: ReactiveMutationFactory(mutationOptions).useMutation,
  });
};
