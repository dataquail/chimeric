import { ref, readonly } from 'vue';
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
    const isIdle = ref(true);
    const isPending = ref(false);
    const isSuccess = ref(false);
    const isError = ref(false);
    const error = ref<TError | null>(null);
    const data = ref<TResult | undefined>(undefined);

    const invoke = async (
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

      isIdle.value = false;
      isPending.value = true;
      isSuccess.value = false;
      isError.value = false;
      error.value = null;

      try {
        const result = await executeWithRetry<TResult>(
          () => asyncFn(params as TParams),
          options?.retry || hookOptions?.retry || 0,
        );
        isPending.value = false;
        isSuccess.value = true;
        data.value = result;
        return result;
      } catch (err) {
        isPending.value = false;
        isError.value = true;
        error.value = err as TError;
        throw err;
      }
    };

    return {
      invoke,
      isIdle: readonly(isIdle),
      isPending: readonly(isPending),
      isSuccess: readonly(isSuccess),
      isError: readonly(isError),
      error: readonly(error),
      data: readonly(data),
    };
  };

  return createReactiveAsync(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reactiveAsync as unknown as ReactiveAsync<TParams, TResult, TError>['useHook'],
  );
}
