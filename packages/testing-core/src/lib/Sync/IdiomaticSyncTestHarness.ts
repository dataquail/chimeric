/* eslint-disable no-async-promise-executor */
import { IdiomaticSync } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { SyncTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function IdiomaticSyncTestHarness<TParams, TResult>(args: {
  idiomaticSync: IdiomaticSync<TParams, TResult>;
  params: TParams;
}): SyncTestHarnessReturnType<TResult>;

// Optional params (must come before no params)
export function IdiomaticSyncTestHarness<TParams, TResult>(args: {
  idiomaticSync: IdiomaticSync<TParams | undefined, TResult>;
  params?: TParams | undefined;
}): SyncTestHarnessReturnType<TResult>;

// No params (least specific - must come last)
export function IdiomaticSyncTestHarness<TResult>(args: {
  idiomaticSync: IdiomaticSync<void, TResult>;
}): SyncTestHarnessReturnType<TResult>;

// Implementation
export function IdiomaticSyncTestHarness<
  TParams = void,
  TResult = unknown,
>(args: {
  idiomaticSync: IdiomaticSync<TParams, TResult>;
  params?: TParams;
}): SyncTestHarnessReturnType<TResult> {
  const { idiomaticSync } = args;
  const params = (args as { params?: TParams })?.params as TParams;
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
}
