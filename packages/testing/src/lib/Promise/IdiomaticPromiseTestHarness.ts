/* eslint-disable no-async-promise-executor */
import { IdiomaticPromise } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';
import { PromiseTestHarness } from './types.js';

export const IdiomaticPromiseTestHarness = <TParams, TResult, E extends Error>({
  idiomaticPromise,
}: {
  idiomaticPromise: IdiomaticPromise<TParams, TResult>;
}): PromiseTestHarness<TParams, TResult, E> => {
  const result = {
    current: {
      call: async (args: TParams) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          idiomaticPromise(args as any)
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
            })
        );
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
