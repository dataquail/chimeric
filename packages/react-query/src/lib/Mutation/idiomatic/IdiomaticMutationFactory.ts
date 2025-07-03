import { type QueryClient } from '@tanstack/react-query';
import { IdiomaticMutation, TanstackIdiomaticNativeOptions } from './types';
import { createIdiomaticMutation } from './createIdiomaticMutation';

export function IdiomaticMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams, TResult, TError>,
): IdiomaticMutation<
  TParams extends undefined ? void : TParams,
  TResult,
  TError
> {
  const mutation = queryClient
    .getMutationCache()
    .build(queryClient, mutationOptions);

  const idiomaticMutation = (
    paramsAndConfig: Parameters<IdiomaticMutation<TParams, TResult, TError>>[0],
  ) => {
    const { options, nativeOptions, ...params } = paramsAndConfig ?? {};
    mutation.setOptions({
      ...mutationOptions,
      ...(options ?? {}),
      ...(nativeOptions ?? {}),
    });
    return mutation.execute(params as TParams);
  };

  return createIdiomaticMutation<TParams, TResult, TError>(
    idiomaticMutation as IdiomaticMutation<TParams, TResult, TError>,
  ) as IdiomaticMutation<
    TParams extends undefined ? void : TParams,
    TResult,
    TError
  >;
}
