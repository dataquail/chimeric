/* eslint-disable no-async-promise-executor */
import { IdiomaticAsync, IdiomaticAsyncOptions } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';
import { AsyncTestHarnessReturnType } from './types';

// Overload for void params
export function IdiomaticAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticAsync: IdiomaticAsync<undefined, TResult>;
  idiomaticOptions?: IdiomaticAsyncOptions;
}): AsyncTestHarnessReturnType<undefined, TResult, E>;

// Overload for object params
export function IdiomaticAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticAsync: IdiomaticAsync<TParams, TResult>;
  idiomaticOptions?: IdiomaticAsyncOptions;
}): AsyncTestHarnessReturnType<TParams, TResult, E>;

// Implementation
export function IdiomaticAsyncTestHarness<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticAsync: IdiomaticAsync<TParams, TResult>;
  idiomaticOptions?: IdiomaticAsyncOptions;
}): AsyncTestHarnessReturnType<TParams, TResult, E> {
  type CallFn = TParams extends undefined
    ? () => Promise<TResult>
    : (params: TParams) => Promise<TResult>;

  const result: AsyncTestHarnessReturnType<TParams, TResult, E>['result'] = {
    current: {
      call: (async (params: TParams) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        return args
          .idiomaticAsync({
            ...(params || {}),
            options: args.idiomaticOptions || {},
          } as {
            options: IdiomaticAsyncOptions;
          } & object)
          .then((data: TResult) => {
            result.current.data = data;
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = true;
            result.current.isError = false;
            result.current.error = null;
            return data;
          })
          .catch((error: unknown) => {
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = false;
            result.current.isError = true;
            result.current.error = error as E;
            throw error;
          });
      }) as CallFn,
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
}
