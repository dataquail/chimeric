import {
  IdiomaticAsync,
  IdiomaticAsyncOptions,
  createIdiomaticAsync,
} from '@chimeric/core';
import { executeWithRetry } from './utils';

export function IdiomaticAsyncFactory<TParams = void, TResult = unknown>(
  asyncFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams extends undefined ? void : TParams, TResult> {
  const idiomaticAsync = ((
    params: TParams & { options?: IdiomaticAsyncOptions },
  ) => {
    return executeWithRetry(() => asyncFn(params), params?.options?.retry);
  }) as IdiomaticAsync<TParams extends undefined ? void : TParams, TResult>;

  return createIdiomaticAsync(idiomaticAsync);
}
