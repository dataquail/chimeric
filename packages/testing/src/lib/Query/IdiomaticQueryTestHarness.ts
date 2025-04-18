/* eslint-disable no-async-promise-executor */
import { IdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { QueryTestHarness } from './types.js';

// Overloads
export function IdiomaticQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticQuery: IdiomaticQuery<void, TResult>;
  params?: void;
  options?: IdiomaticQueryOptions;
}): QueryTestHarness<TResult, E>;
export function IdiomaticQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticQuery: IdiomaticQuery<TParams, TResult>;
  params?: TParams;
  options?: IdiomaticQueryOptions;
}): QueryTestHarness<TResult, E>;

// Implementation
export function IdiomaticQueryTestHarness<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>({
  idiomaticQuery,
  params,
  options,
}: {
  idiomaticQuery: IdiomaticQuery<TParams, TResult>;
  params?: TParams;
  options?: IdiomaticQueryOptions;
}): QueryTestHarness<TResult, E> {
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
  result.current.isIdle = false;
  result.current.isPending = true;
  let promise = idiomaticQuery({
    ...params,
    options: {
      ...options,
    },
  } as {
    options: IdiomaticQueryOptions;
  } & TParams & {
      options?: IdiomaticQueryOptions;
    });
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
            promise = idiomaticQuery({
              ...params,
              options: {
                ...options,
              },
            } as {
              options: IdiomaticQueryOptions;
            } & TParams & {
                options?: IdiomaticQueryOptions;
              });
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
}
