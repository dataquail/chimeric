import type {
  ApiEndpointMutation,
  MutationDefinition,
  EndpointDefinitions,
  QueryArgFrom,
  ResultTypeFrom,
} from '@reduxjs/toolkit/query';
import { createReactiveMutation } from '@chimeric/core';
import { wrapRtkError } from '../../utilities/wrapRtkError';
import {
  ReactiveMutation,
  RtkMutationReactiveNativeOptions,
} from './types';

type MutationEndpointWithHooks = {
  useMutation: (options?: any) => readonly [any, any];
};

export function ReactiveMutationFactory<
  D extends MutationDefinition<any, any, any, any>,
  Definitions extends EndpointDefinitions,
  TError extends Error = Error,
>({
  endpoint,
}: {
  endpoint: ApiEndpointMutation<D, Definitions> & MutationEndpointWithHooks;
}): ReactiveMutation<QueryArgFrom<D>, ResultTypeFrom<D>, TError> {
  const mutationCandidate = (
    allInitialOptions: {
      options?: Record<string, never>;
      nativeOptions?: RtkMutationReactiveNativeOptions;
    } = {},
  ) => {
    const { nativeOptions: initialNativeOptions } = allInitialOptions;

    const [trigger, result] = endpoint.useMutation(initialNativeOptions);

    return {
      invoke: (
        ...args: unknown[]
      ) => {
        const [first] = args;
        const params = first as QueryArgFrom<D>;
        return trigger(params).unwrap() as Promise<ResultTypeFrom<D>>;
      },
      isIdle: result.isUninitialized,
      isPending: result.isLoading,
      isSuccess: result.isSuccess,
      isError: result.isError,
      error: result.error ? (wrapRtkError(result.error) as TError) : null,
      data: result.data as ResultTypeFrom<D> | undefined,
      reset: result.reset,
      native: result,
    };
  };

  return createReactiveMutation(mutationCandidate) as ReactiveMutation<
    QueryArgFrom<D>,
    ResultTypeFrom<D>,
    TError
  >;
}
