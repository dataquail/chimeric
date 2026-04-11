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

    const serializedParams = $derived(JSON.stringify(params));

    let isIdle = $state(true);
    let isPending = $state(false);
    let isSuccess = $state(false);
    let isError = $state(false);
    let error = $state<TError | null>(null);
    let data = $state<TResult | undefined>(undefined);

    $effect(() => {
      // Access serializedParams to track dependency
      void serializedParams;
      const enabled = options?.enabled;

      if (enabled === false) {
        return;
      }

      let mounted = true;

      isIdle = false;
      isPending = true;
      isSuccess = false;
      isError = false;
      error = null;
      data = undefined;

      eagerAsyncFn(params).then(
        (result) => {
          if (mounted) {
            isPending = false;
            isSuccess = true;
            data = result;
          }
        },
        (err: unknown) => {
          if (mounted) {
            isPending = false;
            isError = true;
            error = err as TError;
          }
        },
      );

      return () => {
        mounted = false;
      };
    });

    return {
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

  return createReactiveEagerAsync(
    eagerAsyncCandidate as ReactiveEagerAsync<
      TParams,
      TResult,
      TError
    >['useHook'],
  ) as ReactiveEagerAsync<TParams, TResult, TError>;
}
