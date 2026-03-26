import {
  createReactiveEagerAsync,
  ReactiveEagerAsync,
  ReactiveEagerAsyncOptions,
  validateMaxArgLength,
} from '@chimeric/core';
import { useEffect, useMemo, useState } from 'react';

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

    // Serialize params for dependency tracking
    const serializedParams = useMemo(() => JSON.stringify(params), [params]);

    const [meta, setMeta] = useState<{
      isIdle: boolean;
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
      error: TError | null;
      data: TResult | undefined;
    }>({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    });

    useEffect(() => {
      let isMounted = true;

      const invokeAsync = async () => {
        setMeta({
          isIdle: false,
          isPending: true,
          isSuccess: false,
          isError: false,
          error: null,
          data: undefined,
        });
        try {
          const result = await eagerAsyncFn(params);
          if (isMounted) {
            setMeta({
              isIdle: false,
              isPending: false,
              isSuccess: true,
              isError: false,
              error: null,
              data: result,
            });
          }
        } catch (error) {
          if (isMounted) {
            setMeta({
              isIdle: false,
              isPending: false,
              isSuccess: false,
              isError: true,
              error: error as TError,
              data: undefined,
            });
          }
        }
      };

      if (options?.enabled !== false) {
        invokeAsync();
      }
      return () => {
        isMounted = false;
      };
    }, [serializedParams, options?.enabled]);

    return {
      isIdle: meta.isIdle,
      isPending: meta.isPending,
      isSuccess: meta.isSuccess,
      isError: meta.isError,
      error: meta.error,
      data: meta.data,
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
