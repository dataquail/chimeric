import { IdiomaticAsync, IdiomaticAsyncOptions } from '@chimeric/core';
import { executeWithRetry } from './utils';

interface IdiomaticAsyncFactoryType {
  <TParams extends void, TResult = unknown>(
    asyncFn: () => Promise<TResult>,
  ): IdiomaticAsync<void, TResult>;
  <TParams extends object, TResult = unknown>(
    asyncFn: (params: TParams) => Promise<TResult>,
  ): IdiomaticAsync<TParams, TResult>;
}
export const IdiomaticAsyncFactory: IdiomaticAsyncFactoryType = <
  TParams extends void | object,
  TResult = unknown,
>(
  asyncFn: TParams extends void
    ? () => Promise<TResult>
    : TParams extends object
    ? (params: TParams) => Promise<TResult>
    : never,
): IdiomaticAsync<TParams, TResult> => {
  return ((params: TParams & { options?: IdiomaticAsyncOptions }) => {
    return executeWithRetry(() => asyncFn(params), params?.options?.retry);
  }) as IdiomaticAsync<TParams, TResult>;
};
