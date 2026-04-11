import {
  IdiomaticAsync,
  IdiomaticAsyncOptions,
  createIdiomaticAsync,
} from '@chimeric/core';
import { executeWithRetry } from './utils';

// Optional params
export function IdiomaticAsyncFactory<TParams = void, TResult = unknown>(
  asyncFn: (params?: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams | undefined, TResult>;

// No params
export function IdiomaticAsyncFactory<TResult = unknown>(
  asyncFn: () => Promise<TResult>,
): IdiomaticAsync<void, TResult>;

// Required params
export function IdiomaticAsyncFactory<TParams, TResult = unknown>(
  asyncFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult>;

// Implementation
export function IdiomaticAsyncFactory<TParams = void, TResult = unknown>(
  asyncFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  return createIdiomaticAsync(
    (
      paramsOrOptions?: TParams | IdiomaticAsyncOptions,
      maybeOptions?: IdiomaticAsyncOptions,
    ) => {
      const params =
        asyncFn.length === 0
          ? (undefined as TParams)
          : (paramsOrOptions as TParams);
      const options =
        asyncFn.length === 0
          ? (paramsOrOptions as IdiomaticAsyncOptions)
          : maybeOptions;
      return executeWithRetry(() => asyncFn(params), options?.retry);
    },
  ) as IdiomaticAsync<TParams, TResult>;
}
