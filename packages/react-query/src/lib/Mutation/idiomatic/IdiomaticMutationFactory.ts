import { type QueryClient } from '@tanstack/react-query';
import { IdiomaticMutation, TanstackIdiomaticNativeOptions } from './types';
import { createIdiomaticMutation } from './createIdiomaticMutation';
import { IdiomaticMutationOptions } from 'node_modules/@chimeric/core/src/lib/Mutation/idiomatic/types';

// Optional params
export function IdiomaticMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (params?: TParams) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams | undefined, TResult, TError>,
): IdiomaticMutation<TParams | undefined, TResult, TError>;

// No params
export function IdiomaticMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: () => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<void, TResult, TError>,
): IdiomaticMutation<void, TResult, TError>;

// Required params
export function IdiomaticMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (params: TParams) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams, TResult, TError>,
): IdiomaticMutation<TParams, TResult, TError>;

// Implementation
export function IdiomaticMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  queryClient,
  mutationFn,
  ...mutationDefaultOptions
}: {
  queryClient: QueryClient;
  mutationFn: (params: TParams) => Promise<TResult>;
} & TanstackIdiomaticNativeOptions<
  TParams,
  TResult,
  TError
>): IdiomaticMutation<TParams, TResult, TError> {
  const mutation = queryClient
    .getMutationCache()
    .build(queryClient, mutationDefaultOptions);

  const idiomaticMutation = (
    paramsOrOptions?: Parameters<
      IdiomaticMutation<TParams, TResult, TError>
    >[0],
    maybeOptions?: Parameters<IdiomaticMutation<TParams, TResult, TError>>[1],
  ) => {
    const params =
      mutationFn.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      mutationFn.length === 0
        ? (paramsOrOptions as {
            options?: IdiomaticMutationOptions;
            nativeOptions?: TanstackIdiomaticNativeOptions<
              TParams,
              TResult,
              TError
            >;
          })
        : maybeOptions;
    const options = allOptions?.options as IdiomaticMutationOptions | undefined;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackIdiomaticNativeOptions<TParams, TResult, TError>
      | undefined;
    mutation.setOptions({
      mutationFn: () => mutationFn(params as TParams),
      ...mutationDefaultOptions,
      ...(options ?? {}),
      ...(nativeOptions ?? {}),
    });
    return mutation.execute(params as TParams);
  };

  return createIdiomaticMutation<TParams, TResult, TError>(
    idiomaticMutation,
  ) as IdiomaticMutation<TParams, TResult, TError>;
}
