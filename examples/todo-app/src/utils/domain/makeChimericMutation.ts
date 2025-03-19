import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { ChimericMutation } from './ChimericMutation';

export const makeChimericMutation = <
  TParams,
  TResult,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
>({
  mutationFn,
  errorHelpers,
  onSuccess,
}: {
  mutationFn: (args: TParams) => Promise<TResult>;
  errorHelpers: ErrorHelpers;
  onSuccess?: (data: TResult, variables: TParams) => Promise<void>;
}): ChimericMutation<TParams, TResult, E, ErrorHelpers> => {
  const defaultOnSuccess = onSuccess ?? (async () => {});
  return {
    call: async (args) => {
      const result = await mutationFn(args);
      await defaultOnSuccess(result, args);
      return result;
    },
    useMutation: (config?: {
      options: UseMutationOptions<TResult, E, TParams>;
    }) => {
      const mutation = useMutation<TResult, E, TParams, unknown>({
        mutationFn,
        onSuccess: (data, variables) => defaultOnSuccess(data, variables),
        ...(config?.options ?? {}),
      });

      return {
        call: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
      };
    },
    errorHelpers,
  };
};
