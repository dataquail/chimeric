/* eslint-disable no-async-promise-executor */
import { IdiomaticMutation, IdiomaticMutationOptions } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { IdiomaticMutationTestHarnessReturnType } from './types.js';

export function IdiomaticMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>({
  idiomaticMutation,
}: {
  idiomaticMutation: IdiomaticMutation<
    TParams,
    TResult,
    TIdiomaticNativeOptions
  >;
}): IdiomaticMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TIdiomaticNativeOptions
> {
  const result = {
    current: {
      invoke: (
        params: TParams & {
          options?: IdiomaticMutationOptions;
          nativeOptions?: TIdiomaticNativeOptions;
        },
      ) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        const promise = idiomaticMutation(params);
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
  } as IdiomaticMutationTestHarnessReturnType<
    TParams,
    TResult,
    E,
    TIdiomaticNativeOptions
  >;
}
