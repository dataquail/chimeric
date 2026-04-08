import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type {
  ApiEndpointMutation,
  MutationDefinition,
  EndpointDefinitions,
  QueryArgFrom,
  ResultTypeFrom,
} from '@reduxjs/toolkit/query';
import { createIdiomaticMutation, IdiomaticMutationOptions } from '@chimeric/core';
import { isChimericAllOptions } from '../../utilities/isChimericAllOptions';
import {
  IdiomaticMutation,
  RtkMutationIdiomaticNativeOptions,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any -- RTK Query types require `any` for generic constraints and store dispatch */
export function IdiomaticMutationFactory<
  D extends MutationDefinition<any, any, any, any>,
  Definitions extends EndpointDefinitions,
>({
  store,
  endpoint,
}: {
  store: { dispatch: ThunkDispatch<any, any, UnknownAction> };
  endpoint: ApiEndpointMutation<D, Definitions>;
}): IdiomaticMutation<QueryArgFrom<D>, ResultTypeFrom<D>> {
  const idiomaticMutation = async (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const firstIsOptions = second === undefined && isChimericAllOptions(first);
    const params = firstIsOptions ? (undefined as QueryArgFrom<D>) : (first as QueryArgFrom<D>);
    const allOptions = (firstIsOptions ? first : second) as
      | {
          options?: IdiomaticMutationOptions;
          nativeOptions?: RtkMutationIdiomaticNativeOptions;
        }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    const result = store.dispatch(
      endpoint.initiate(params, nativeOptions),
    );
    return (await result.unwrap()) as ResultTypeFrom<D>;
  };

  return createIdiomaticMutation(idiomaticMutation) as IdiomaticMutation<
    QueryArgFrom<D>,
    ResultTypeFrom<D>
  >;
}
