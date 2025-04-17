import { IdiomaticAsync, IdiomaticAsyncOptions } from '@chimeric/core';
import { executeWithRetry } from './utils';

export function IdiomaticAsyncFactory<TResult = unknown>(
  asyncFn: () => Promise<TResult>,
): IdiomaticAsync<void, TResult>;
export function IdiomaticAsyncFactory<
  TParams extends object,
  TResult = unknown,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult>;

export function IdiomaticAsyncFactory<
  TParams extends void | object,
  TResult = unknown,
>(
  asyncFn: TParams extends void
    ? () => Promise<TResult>
    : (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  return ((params: TParams & { options?: IdiomaticAsyncOptions }) => {
    return executeWithRetry(() => asyncFn(params), params?.options?.retry);
  }) as IdiomaticAsync<TParams, TResult>;
}
