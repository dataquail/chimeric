import { ref, readonly, onMounted, watch } from 'vue';
import {
  createReactiveEagerAsync,
  ReactiveEagerAsync,
  ReactiveEagerAsyncOptions,
  validateMaxArgLength,
} from '@chimeric/core';

// Required params
export function ReactiveEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ReactiveEagerAsync<TParams, TResult, TError>;

// Optional params
export function ReactiveEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params?: TParams) => Promise<TResult>;
}): ReactiveEagerAsync<TParams | undefined, TResult, TError>;

// No params
export function ReactiveEagerAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: () => Promise<TResult>;
}): ReactiveEagerAsync<void, TResult, TError>;

// Implementation
export function ReactiveEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  eagerAsyncFn,
}: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ReactiveEagerAsync<TParams, TResult, TError> {
  validateMaxArgLength({
    fn: eagerAsyncFn,
    fnName: 'eagerAsyncFn',
    maximumLength: 1,
  });

  const eagerAsyncCandidate = (
    paramsOrOptions?: Parameters<
      ReactiveEagerAsync<TParams, TResult, TError>['useHook']
    >[0],
    maybeOptions?: Parameters<
      ReactiveEagerAsync<TParams, TResult, TError>['useHook']
    >[1],
  ) => {
    const params =
      eagerAsyncFn.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const options =
      eagerAsyncFn.length === 0
        ? (paramsOrOptions as ReactiveEagerAsyncOptions)
        : maybeOptions;

    const isIdle = ref(true);
    const isPending = ref(false);
    const isSuccess = ref(false);
    const isError = ref(false);
    const error = ref<TError | null>(null);
    const data = ref<TResult | undefined>(undefined);

    // Serialize params for reactivity tracking
    const serializedParams = JSON.stringify(params);

    const invokeAsync = async () => {
      isIdle.value = false;
      isPending.value = true;
      isSuccess.value = false;
      isError.value = false;
      error.value = null;
      data.value = undefined;

      try {
        const result = await eagerAsyncFn(params);
        isPending.value = false;
        isSuccess.value = true;
        data.value = result;
      } catch (err) {
        isPending.value = false;
        isError.value = true;
        error.value = err as TError;
      }
    };

    onMounted(async () => {
      if (options?.enabled !== false) {
        await invokeAsync();
      }
    });

    // Re-run when params change
    watch(
      () => serializedParams,
      async () => {
        if (options?.enabled !== false) {
          await invokeAsync();
        }
      },
    );

    return {
      isIdle: readonly(isIdle),
      isPending: readonly(isPending),
      isSuccess: readonly(isSuccess),
      isError: readonly(isError),
      error: readonly(error),
      data: readonly(data),
    };
  };

  return createReactiveEagerAsync(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eagerAsyncCandidate as unknown as ReactiveEagerAsync<
      TParams,
      TResult,
      TError
    >['useHook'],
  ) as ReactiveEagerAsync<TParams, TResult, TError>;
}
