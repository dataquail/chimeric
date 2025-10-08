/* eslint-disable no-async-promise-executor */
import { IdiomaticEagerAsync } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function IdiomaticEagerAsyncTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
>(args: {
  idiomaticEagerAsync: IdiomaticEagerAsync<TParams, TResult>;
  params: TParams;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// No params (must come before optional params)
export function IdiomaticEagerAsyncTestHarness<
  TResult,
  TError extends Error = Error,
>(args: {
  idiomaticEagerAsync: IdiomaticEagerAsync<void, TResult>;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Optional params (must come last)
export function IdiomaticEagerAsyncTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
>(args: {
  idiomaticEagerAsync: IdiomaticEagerAsync<TParams | undefined, TResult>;
  params?: TParams | undefined;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Implementation
export function IdiomaticEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomaticEagerAsync,
  params,
}: {
  idiomaticEagerAsync: IdiomaticEagerAsync<TParams | undefined, TResult>;
  params?: TParams | undefined;
}): EagerAsyncTestHarnessReturnType<TResult, TError> {
  const result = {
    current: {
      data: undefined as TResult | undefined,
      isIdle: true,
      isSuccess: false,
      isPending: true,
      isError: false,
      error: null as TError | null,
    },
  };
  let promiseStatus = 'initial' as
    | 'initial'
    | 'pending'
    | 'resolved'
    | 'rejected';
  result.current.isIdle = false;
  result.current.isPending = true;
  let promise = idiomaticEagerAsync(params as TParams);
  promiseStatus = 'pending';
  promise
    .then((data) => {
      result.current.data = data;
      result.current.isIdle = false;
      result.current.isPending = false;
      result.current.isSuccess = true;
      result.current.isError = false;
      result.current.error = null;
      promiseStatus = 'resolved';
    })
    .catch((error: TError) => {
      result.current.isIdle = false;
      result.current.isPending = false;
      result.current.isSuccess = false;
      result.current.isError = true;
      result.current.error = error;
      promiseStatus = 'rejected';
    });

  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (options?.reinvokeIdiomaticFn && promiseStatus === 'resolved') {
            promise = idiomaticEagerAsync(params as TParams);
            promiseStatus = 'pending';
            promise
              .then((data) => {
                result.current.data = data;
                result.current.isIdle = false;
                result.current.isPending = false;
                result.current.isSuccess = true;
                result.current.isError = false;
                result.current.error = null;
                promiseStatus = 'resolved';
              })
              .catch((error: TError) => {
                result.current.isIdle = false;
                result.current.isPending = false;
                result.current.isSuccess = false;
                result.current.isError = true;
                result.current.error = error;
                promiseStatus = 'rejected';
              });
          }
          await promise;
          await checkOnInterval(
            cb,
            options?.interval ?? 1,
            options?.timeout ?? 3000,
            resolve,
            reject,
          );
        } catch (error) {
          if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error(String(error)));
          }
        }
      });
    },
    result,
  };
}
