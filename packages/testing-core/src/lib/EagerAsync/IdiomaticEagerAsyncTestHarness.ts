/* eslint-disable no-async-promise-executor */
import {
  IdiomaticEagerAsync,
  IdiomaticEagerAsyncOptions,
} from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// No params
export function IdiomaticEagerAsyncTestHarness<
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomaticEagerAsync,
  idiomaticOptions,
}: {
  idiomaticEagerAsync: IdiomaticEagerAsync<void, TResult>;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Optional params
export function IdiomaticEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomaticEagerAsync,
  params,
  idiomaticOptions,
}: {
  idiomaticEagerAsync: IdiomaticEagerAsync<TParams | undefined, TResult>;
  params?: TParams;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Required params
export function IdiomaticEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomaticEagerAsync,
  params,
  idiomaticOptions,
}: {
  idiomaticEagerAsync: IdiomaticEagerAsync<TParams, TResult>;
  params: TParams;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Implementation
export function IdiomaticEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomaticEagerAsync,
  params,
  idiomaticOptions,
}: {
  idiomaticEagerAsync: IdiomaticEagerAsync<TParams, TResult>;
  params?: TParams;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
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

  const callFunction = () => {
    if (params !== undefined) {
      return (idiomaticEagerAsync as (p: TParams, o?: IdiomaticEagerAsyncOptions) => Promise<TResult>)(params, idiomaticOptions);
    } else {
      return (idiomaticEagerAsync as (o?: IdiomaticEagerAsyncOptions) => Promise<TResult>)(idiomaticOptions);
    }
  };

  let promise = callFunction();
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
    .catch((error) => {
      result.current.isIdle = false;
      result.current.isPending = false;
      result.current.isSuccess = false;
      result.current.isError = true;
      result.current.error = error as TError;
      promiseStatus = 'rejected';
    });

  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (options?.reinvokeIdiomaticFn && promiseStatus === 'resolved') {
            promise = callFunction();
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
              .catch((error) => {
                result.current.isIdle = false;
                result.current.isPending = false;
                result.current.isSuccess = false;
                result.current.isError = true;
                result.current.error = error as TError;
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
