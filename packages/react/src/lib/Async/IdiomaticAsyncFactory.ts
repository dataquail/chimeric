import { IdiomaticAsync, IdiomaticAsyncOptions } from '@chimeric/core';
import { executeWithRetry } from './utils';

export function IdiomaticAsyncFactory<TParams, TResult>(
  asyncFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  return ((params: TParams & { options?: IdiomaticAsyncOptions }) => {
    return executeWithRetry(() => asyncFn(params), params?.options?.retry);
  }) as IdiomaticAsync<TParams, TResult>;
}
