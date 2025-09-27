/* eslint-disable no-async-promise-executor */
import { IdiomaticInfiniteQuery, IdiomaticInfiniteQueryOptions } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { IdiomaticInfiniteQueryTestHarnessReturnType } from './types.js';

export function IdiomaticInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(
  args: TParams extends void
    ? {
        idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TIdiomaticNativeOptions
        >;
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TIdiomaticNativeOptions;
      }
    : {
        idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TIdiomaticNativeOptions
        >;
        params: TParams;
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TIdiomaticNativeOptions;
      },
): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError> {
  const { idiomaticInfiniteQuery, options, nativeOptions } = args;
  const result = {
    current: {
      data: undefined as { pages: TPageData[]; pageParams: TPageParam[] } | undefined,
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
  let promise = idiomaticInfiniteQuery({
    ...(args as { params: TParams }).params,
    options,
    nativeOptions,
  } as {
    options: IdiomaticInfiniteQueryOptions<TPageParam>;
    nativeOptions: TIdiomaticNativeOptions;
  } & TParams & {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TIdiomaticNativeOptions;
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
      result.current.error = error as TError;
      promiseStatus = 'rejected';
    });

  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        try {
          if (options?.reinvokeIdiomaticFn && promiseStatus === 'resolved') {
            promise = idiomaticInfiniteQuery({
              ...(args as { params: TParams }).params,
              options,
              nativeOptions,
            } as {
              options: IdiomaticInfiniteQueryOptions<TPageParam>;
              nativeOptions: TIdiomaticNativeOptions;
            } & TParams & {
                options?: IdiomaticInfiniteQueryOptions<TPageParam>;
                nativeOptions?: TIdiomaticNativeOptions;
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