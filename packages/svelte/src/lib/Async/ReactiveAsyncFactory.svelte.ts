import {
  createReactiveAsync,
  ReactiveAsync,
  ReactiveAsyncInvokeOptions,
  ReactiveAsyncOptions,
} from '@chimeric/core';
import { executeWithRetry } from './utils';

// Optional params
export function ReactiveAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params?: TParams) => Promise<TResult>,
): ReactiveAsync<TParams | undefined, TResult, TError>;

// No params
export function ReactiveAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(asyncFn: () => Promise<TResult>): ReactiveAsync<void, TResult, TError>;

// Required params
export function ReactiveAsyncFactory<
  TParams,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ReactiveAsync<TParams, TResult, TError>;

// Implementation
export function ReactiveAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ReactiveAsync<TParams, TResult, TError> {
  const reactiveAsync = (hookOptions?: ReactiveAsyncOptions) => {
    let isIdle = $state(true);
    let isPending = $state(false);
    let isSuccess = $state(false);
    let isError = $state(false);
    let error = $state<TError | null>(null);
    let data = $state<TResult | undefined>(undefined);

    return {
      invoke: async (
        paramsOrOptions?: TParams | ReactiveAsyncInvokeOptions,
        maybeOptions?: ReactiveAsyncInvokeOptions,
      ) => {
        const params =
          asyncFn.length === 0
            ? (undefined as TParams)
            : (paramsOrOptions as TParams);
        const options =
          asyncFn.length === 0
            ? (paramsOrOptions as ReactiveAsyncInvokeOptions)
            : maybeOptions;

        isIdle = false;
        isPending = true;
        isSuccess = false;
        isError = false;
        error = null;
        data = undefined;

        try {
          const result = await executeWithRetry<TResult>(
            () => asyncFn(params as TParams),
            options?.retry || hookOptions?.retry || 0,
          );
          isPending = false;
          isSuccess = true;
          data = result;
          return result;
        } catch (err) {
          isPending = false;
          isError = true;
          error = err as TError;
          throw err;
        }
      },
      get isIdle() {
        return isIdle;
      },
      get isPending() {
        return isPending;
      },
      get isSuccess() {
        return isSuccess;
      },
      get isError() {
        return isError;
      },
      get error() {
        return error;
      },
      get data() {
        return data;
      },
    };
  };

  return createReactiveAsync(
    reactiveAsync as ReactiveAsync<TParams, TResult, TError>['useHook'],
  );
}
