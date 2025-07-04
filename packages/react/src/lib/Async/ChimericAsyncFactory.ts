import { ChimericAsync, fuseChimericAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { ReactiveAsyncFactory } from './ReactiveAsyncFactory';

export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ChimericAsync<TParams extends undefined ? void : TParams, TResult, TError> {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn),
  }) as ChimericAsync<
    TParams extends undefined ? void : TParams,
    TResult,
    TError
  >;
}
