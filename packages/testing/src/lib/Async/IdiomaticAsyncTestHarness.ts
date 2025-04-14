/* eslint-disable no-async-promise-executor */
import { IdiomaticAsync } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { AsyncTestHarness } from './types.js';

export const IdiomaticAsyncTestHarness = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  idiomaticAsync,
}: {
  idiomaticAsync: IdiomaticAsync<TParams, TResult>;
}): AsyncTestHarness<TParams, TResult, E> => {
  const result: AsyncTestHarness<TParams, TResult, E>['result'] = {
    current: {
      call: (async (args) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        return idiomaticAsync(args)
          .then((data) => {
            result.current.data = data;
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = true;
            result.current.isError = false;
            result.current.error = null;
            return data;
          })
          .catch((error) => {
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = false;
            result.current.isError = true;
            result.current.error = error as E;
          });
      }) as AsyncTestHarness<TParams, TResult, E>['result']['current']['call'],
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
    result: result,
  };
};
