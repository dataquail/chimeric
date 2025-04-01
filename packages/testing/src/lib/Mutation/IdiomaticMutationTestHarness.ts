/* eslint-disable no-async-promise-executor */
import { IdiomaticMutation } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { MutationTestHarness } from './types.js';

export const IdiomaticMutationTestHarness = <
  TParams,
  TResult,
  E extends Error,
>({
  idiomaticMutation,
}: {
  idiomaticMutation: IdiomaticMutation<TParams, TResult>;
}): MutationTestHarness<TParams, TResult, E> => {
  const result = {
    current: {
      call: (args: TParams) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise = idiomaticMutation(args as any);
        promise
          .then((data) => {
            result.current.data = data;
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = true;
            result.current.isError = false;
            result.current.error = null;
          })
          .catch((error) => {
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = false;
            result.current.isError = true;
            result.current.error = error as E;
          });

        return promise;
      },
      data: undefined as TResult | undefined,
      isIdle: true,
      isSuccess: false,
      isPending: false,
      isError: false,
      error: null as E | null,
    },
  };
  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        await checkOnInterval(
          cb,
          options?.interval ?? 1,
          options?.timeout ?? 3000,
          resolve,
          reject,
        );
      });
    },
    result,
  };
};
