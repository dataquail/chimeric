/* eslint-disable no-async-promise-executor */
import { IdiomaticSync } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { SyncTestHarness } from './types .js';

export const IdiomaticSyncTestHarness = <
  TParams = undefined,
  TResult = unknown,
>({
  idiomaticSync,
  params,
}: {
  idiomaticSync: IdiomaticSync<TParams, TResult>;
  params?: TParams;
}): SyncTestHarness<TResult> => {
  const result = {
    current: undefined as TResult | undefined,
  };
  const returnValue = {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        await checkOnInterval(
          () => {
            if (options?.reinvokeIdiomaticFn) {
              result.current = idiomaticSync(params as TParams);
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
  result.current = idiomaticSync(params as TParams);
  return returnValue;
};
