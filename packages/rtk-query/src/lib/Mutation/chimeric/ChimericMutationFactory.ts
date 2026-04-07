import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type {
  ApiEndpointMutation,
  MutationDefinition,
  EndpointDefinitions,
  QueryArgFrom,
  ResultTypeFrom,
} from '@reduxjs/toolkit/query';
import { fuseChimericMutation } from '@chimeric/core';
import { IdiomaticMutationFactory } from '../idiomatic/IdiomaticMutationFactory';
import { ReactiveMutationFactory } from '../reactive/ReactiveMutationFactory';
import { type ChimericMutation } from './types';

type MutationEndpointWithHooks = {
  useMutation: (options?: any) => readonly [any, any];
};

export function ChimericMutationFactory<
  D extends MutationDefinition<any, any, any, any>,
  Definitions extends EndpointDefinitions,
  TError extends Error = Error,
>({
  store,
  endpoint,
}: {
  store: { dispatch: ThunkDispatch<any, any, UnknownAction> };
  endpoint: ApiEndpointMutation<D, Definitions> & MutationEndpointWithHooks;
}): ChimericMutation<QueryArgFrom<D>, ResultTypeFrom<D>, TError> {
  return fuseChimericMutation({
    idiomatic: IdiomaticMutationFactory({ store, endpoint }),
    reactive: ReactiveMutationFactory<D, Definitions, TError>({ endpoint }),
  }) as ChimericMutation<QueryArgFrom<D>, ResultTypeFrom<D>, TError>;
}
