/* eslint-disable no-async-promise-executor */
import {
  IdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
} from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { IdiomaticInfiniteQueryTestHarnessReturnType } from './types.js';

// Required params
export function IdiomaticInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TIdiomaticNativeOptions
  >;
  params: TParams;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;

// Optional params
export function IdiomaticInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TIdiomaticNativeOptions
  >;
  params?: TParams | undefined;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;

// No params
export function IdiomaticInfiniteQueryTestHarness<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TIdiomaticNativeOptions
  >;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;

// Implementation
export function IdiomaticInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>({
  idiomaticInfiniteQuery,
  params,
  options,
  nativeOptions,
}: {
  idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TIdiomaticNativeOptions
  >;
  params?: TParams | undefined;
  options?: IdiomaticInfiniteQueryOptions<TPageParam>;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError> {
  const result = {
    current: {
      data: undefined as
        | { pages: TPageData[]; pageParams: TPageParam[] }
        | undefined,
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

  const allOptions = {};
  if (options) {
    (
      allOptions as { options?: IdiomaticInfiniteQueryOptions<TPageParam> }
    ).options = options;
  }
  if (nativeOptions) {
    (allOptions as { nativeOptions?: TIdiomaticNativeOptions }).nativeOptions =
      nativeOptions;
  }

  const hookArgs =
    idiomaticInfiniteQuery.length === 1
      ? Object.keys(allOptions).length
        ? ([allOptions] as const)
        : []
      : Object.keys(allOptions).length
      ? ([params, allOptions] as const)
      : ([params] as const);

  let promise = idiomaticInfiniteQuery(...(hookArgs as [any]));
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
            promise = idiomaticInfiniteQuery(...(hookArgs as [any]));
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
