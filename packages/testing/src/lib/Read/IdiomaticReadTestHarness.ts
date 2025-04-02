/* eslint-disable no-async-promise-executor */
import { IdiomaticRead } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReadTestHarness } from './types.js';

export const IdiomaticReadTestHarness = <TParams, TResult>({
  idiomaticRead,
  params,
}: {
  idiomaticRead: IdiomaticRead<TParams, TResult>;
  params?: TParams;
}): ReadTestHarness<TResult> => {
  const result = {
    current: undefined as TResult | undefined,
  };
  const returnValue = {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        await checkOnInterval(
          () => {
            if (options?.reinvokeIdiomaticFn) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              result.current = idiomaticRead(params as any);
            }
            cb();
          },
          options?.interval ?? 1,
          options?.timeout ?? 3000,
          resolve,
          reject,
        );
      });
    },
    result,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result.current = idiomaticRead(params as any);
  return returnValue;
};
