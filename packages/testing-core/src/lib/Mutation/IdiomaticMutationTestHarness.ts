/* eslint-disable no-async-promise-executor */
import { IdiomaticMutation, IdiomaticMutationOptions } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { IdiomaticMutationTestHarnessReturnType } from './types.js';

// No params
export function IdiomaticMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>({
  idiomaticMutation,
}: {
  idiomaticMutation: IdiomaticMutation<void, TResult, TIdiomaticNativeOptions>;
}): IdiomaticMutationTestHarnessReturnType<
  void,
  TResult,
  E,
  TIdiomaticNativeOptions
>;

// Optional params
export function IdiomaticMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>({
  idiomaticMutation,
}: {
  idiomaticMutation: IdiomaticMutation<
    TParams | undefined,
    TResult,
    TIdiomaticNativeOptions
  >;
}): IdiomaticMutationTestHarnessReturnType<
  TParams | undefined,
  TResult,
  E,
  TIdiomaticNativeOptions
>;

// Required params
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
>;

// Implementation
export function IdiomaticMutationTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
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
  TError,
  TIdiomaticNativeOptions
> {
  const result = {
    current: {
      invoke: (
        ...invokeArgs: [
          TParams & undefined,
          {
            options?: IdiomaticMutationOptions;
            nativeOptions?: TIdiomaticNativeOptions | undefined;
          },
        ]
      ) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        const promise = idiomaticMutation(...invokeArgs);
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
            result.current.error = error as TError;
          });

        return promise;
      },
      data: undefined as TResult | undefined,
      isIdle: true,
      isSuccess: false,
      isPending: false,
      isError: false,
      error: null as TError | null,
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
    TError,
    TIdiomaticNativeOptions
  >;
}
