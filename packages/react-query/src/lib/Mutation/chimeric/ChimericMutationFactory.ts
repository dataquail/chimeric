import { type QueryClient } from '@tanstack/react-query';
import { IdiomaticMutationFactory } from '../idiomatic/IdiomaticMutationFactory';
import { ReactiveMutationFactory } from '../reactive/ReactiveMutationFactory';
import { ChimericMutation } from './types';
import { fuseChimericMutation } from './fuseChimericMutation';
import { TanstackIdiomaticNativeOptions } from '../idiomatic/types';

export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams, TResult, TError>,
): ChimericMutation<
  TParams extends undefined ? void : TParams,
  TResult,
  TError
> {
  return fuseChimericMutation({
    idiomatic: IdiomaticMutationFactory(queryClient, mutationOptions),
    reactive: ReactiveMutationFactory(mutationOptions),
  });
}
