import { ChimericAsync, fuseChimericAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { ReactiveAsyncFactory } from './ReactiveAsyncFactory';

export function ChimericAsyncFactory<TParams, TResult, E extends Error = Error>(
  asyncFn: TParams extends undefined
    ? () => Promise<TResult>
    : TParams extends object
    ? (params: TParams) => Promise<TResult>
    : TParams extends unknown
    ? () => Promise<TResult>
    : never,
): ChimericAsync<TParams, TResult, E> {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn),
  }) as ChimericAsync<TParams, TResult, E>;
}
