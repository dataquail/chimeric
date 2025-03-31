/* eslint-disable no-async-promise-executor */
import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ChimericQuery } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';
import { WaitForReadOptions } from '../types/WaitForOptions.js';

export const ChimericQueryTestHarness = <TParams, TResult, E extends Error>({
  chimericQuery,
  chimericMethod,
  params,
  wrapper,
}: {
  chimericQuery: ChimericQuery<TParams, TResult, E>;
  chimericMethod: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
} => {
  const result = {
    current: {
      data: undefined as TResult | undefined,
      isIdle: true,
      isSuccess: false,
      isPending: true,
      isError: false,
      error: null as E | null,
    },
  };
  let promiseStatus = 'initial' as
    | 'initial'
    | 'pending'
    | 'resolved'
    | 'rejected';
  if (chimericMethod === 'idiomatic') {
    result.current.isIdle = false;
    result.current.isPending = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promise = chimericQuery(params as any);
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
        result.current.error = error as E;
        promiseStatus = 'rejected';
      });

    return {
      waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
        return new Promise<void>(async (resolve, reject) => {
          try {
            if (options?.reinvokeIdiomaticFn && promiseStatus === 'resolved') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              promise = chimericQuery(params as any);
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
                  result.current.error = error as E;
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
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hook = renderHook(() => chimericQuery.useQuery(params as any), {
      wrapper,
    });
    return {
      waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
        await waitForReactTestingLibrary(cb, {
          timeout: options?.timeout,
          interval: options?.interval,
        });
      },
      result: hook.result,
    };
  }
};
