// /* eslint-disable no-async-promise-executor */
// import { IdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
// import { checkOnInterval } from '../checkOnInterval.js';
// import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
// import { IdiomaticQueryTestHarnessReturnType } from './types.js';

// export function IdiomaticQueryTestHarness<
//   TParams = void,
//   TResult = unknown,
//   TError extends Error = Error,
//   TIdiomaticNativeOptions = unknown,
// >(
//   args: TParams extends void
//     ? {
//         idiomaticQuery: IdiomaticQuery<
//           TParams,
//           TResult,
//           TIdiomaticNativeOptions
//         >;
//         options?: IdiomaticQueryOptions;
//         nativeOptions?: TIdiomaticNativeOptions;
//       }
//     : {
//         idiomaticQuery: IdiomaticQuery<
//           TParams,
//           TResult,
//           TIdiomaticNativeOptions
//         >;
//         params: TParams;
//         options?: IdiomaticQueryOptions;
//         nativeOptions?: TIdiomaticNativeOptions;
//       },
// ): IdiomaticQueryTestHarnessReturnType<TResult, TError> {
//   const { idiomaticQuery, options, nativeOptions } = args;
//   const result = {
//     current: {
//       data: undefined as TResult | undefined,
//       isIdle: true,
//       isSuccess: false,
//       isPending: true,
//       isError: false,
//       error: null as TError | null,
//     },
//   };
//   let promiseStatus = 'initial' as
//     | 'initial'
//     | 'pending'
//     | 'resolved'
//     | 'rejected';
//   result.current.isIdle = false;
//   result.current.isPending = true;
//   let promise = idiomaticQuery({
//     ...(args as { params: TParams }).params,
//     options,
//     nativeOptions,
//   } as {
//     options: IdiomaticQueryOptions;
//     nativeOptions: TIdiomaticNativeOptions;
//   } & TParams & {
//       options?: IdiomaticQueryOptions;
//       nativeOptions?: TIdiomaticNativeOptions;
//     });
//   promiseStatus = 'pending';
//   promise
//     .then((data) => {
//       result.current.data = data;
//       result.current.isIdle = false;
//       result.current.isPending = false;
//       result.current.isSuccess = true;
//       result.current.isError = false;
//       result.current.error = null;
//       promiseStatus = 'resolved';
//     })
//     .catch((error) => {
//       result.current.isIdle = false;
//       result.current.isPending = false;
//       result.current.isSuccess = false;
//       result.current.isError = true;
//       result.current.error = error as TError;
//       promiseStatus = 'rejected';
//     });

//   return {
//     waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
//       return new Promise<void>(async (resolve, reject) => {
//         try {
//           if (options?.reinvokeIdiomaticFn && promiseStatus === 'resolved') {
//             promise = idiomaticQuery({
//               ...(args as { params: TParams }).params,
//               options,
//               nativeOptions,
//             } as {
//               options: IdiomaticQueryOptions;
//               nativeOptions: TIdiomaticNativeOptions;
//             } & TParams & {
//                 options?: IdiomaticQueryOptions;
//                 nativeOptions?: TIdiomaticNativeOptions;
//               });
//             promiseStatus = 'pending';
//             promise
//               .then((data) => {
//                 result.current.data = data;
//                 result.current.isIdle = false;
//                 result.current.isPending = false;
//                 result.current.isSuccess = true;
//                 result.current.isError = false;
//                 result.current.error = null;
//                 promiseStatus = 'resolved';
//               })
//               .catch((error) => {
//                 result.current.isIdle = false;
//                 result.current.isPending = false;
//                 result.current.isSuccess = false;
//                 result.current.isError = true;
//                 result.current.error = error as TError;
//                 promiseStatus = 'rejected';
//               });
//           }
//           await promise;
//           await checkOnInterval(
//             cb,
//             options?.interval ?? 1,
//             options?.timeout ?? 3000,
//             resolve,
//             reject,
//           );
//         } catch (error) {
//           if (error instanceof Error) {
//             reject(error);
//           } else {
//             reject(new Error(String(error)));
//           }
//         }
//       });
//     },
//     result,
//   };
// }
/* eslint-disable no-async-promise-executor */
import { IdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
import { checkOnInterval } from '../checkOnInterval.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { IdiomaticQueryTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function IdiomaticQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticQuery: IdiomaticQuery<TParams, TResult, TIdiomaticNativeOptions>;
  params: TParams;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError>;

// Optional params (must come before no params)
export function IdiomaticQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticQuery: IdiomaticQuery<
    TParams | undefined,
    TResult,
    TIdiomaticNativeOptions
  >;
  params?: TParams | undefined;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError>;

// No params (least specific - must come last)
export function IdiomaticQueryTestHarness<
  TResult,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticQuery: IdiomaticQuery<void, TResult, TIdiomaticNativeOptions>;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError>;

// Implementation
export function IdiomaticQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TIdiomaticNativeOptions = unknown,
>(args: {
  idiomaticQuery: IdiomaticQuery<TParams, TResult, TIdiomaticNativeOptions>;
  params?: TParams;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TIdiomaticNativeOptions;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError> {
  const { idiomaticQuery, options, nativeOptions, params } = args;
  const result = {
    current: {
      data: undefined as TResult | undefined,
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

  let allOptions:
    | {
        options?: IdiomaticQueryOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      }
    | undefined = {};

  if (options === undefined && nativeOptions === undefined) {
    allOptions = undefined;
  } else {
    if (options) {
      allOptions.options = options;
    }
    if (nativeOptions) {
      allOptions.nativeOptions = nativeOptions;
    }
  }

  const hookArgs =
    allOptions !== undefined
      ? [params, allOptions]
      : [params].filter((arg) => arg !== undefined);

  let promise = idiomaticQuery(...(hookArgs as [TParams, typeof allOptions]));
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
            promise = idiomaticQuery(
              ...(hookArgs as [TParams, typeof allOptions]),
            );
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
