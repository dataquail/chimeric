import {
  createIdiomaticEagerAsync,
  IdiomaticEagerAsync,
  IdiomaticEagerAsyncOptions,
  validateMaxArgLength,
} from '@chimeric/core';
import { executeWithRetry } from '../Async/utils';

// Required params
export function IdiomaticEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
>(config: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): IdiomaticEagerAsync<TParams, TResult>;

// Optional params
export function IdiomaticEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
>(config: {
  eagerAsyncFn: (params?: TParams) => Promise<TResult>;
}): IdiomaticEagerAsync<TParams | undefined, TResult>;

// No params
export function IdiomaticEagerAsyncFactory<TResult = unknown>(config: {
  eagerAsyncFn: () => Promise<TResult>;
}): IdiomaticEagerAsync<void, TResult>;

// Implementation
export function IdiomaticEagerAsyncFactory<TParams = void, TResult = unknown>({
  eagerAsyncFn,
}: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): IdiomaticEagerAsync<TParams, TResult> {
  validateMaxArgLength({
    fn: eagerAsyncFn,
    fnName: 'eagerAsyncFn',
    maximumLength: 1,
  });
  const eagerAsyncCandidate = async (
    paramsOrOptions?: Parameters<IdiomaticEagerAsync<TParams, TResult>>[0],
    maybeOptions?: Parameters<IdiomaticEagerAsync<TParams, TResult>>[1],
  ) => {
    const params =
      eagerAsyncFn.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const options =
      eagerAsyncFn.length === 0
        ? (paramsOrOptions as IdiomaticEagerAsyncOptions)
        : maybeOptions;

    return executeWithRetry(() => eagerAsyncFn(params), options?.retry);
  };

  return createIdiomaticEagerAsync(eagerAsyncCandidate) as IdiomaticEagerAsync<
    TParams,
    TResult
  >;
}
