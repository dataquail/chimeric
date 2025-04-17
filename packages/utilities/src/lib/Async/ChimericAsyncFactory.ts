import { ChimericAsync, fuseChimericAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { ReactiveAsyncFactory } from './ReactiveAsyncFactory';

interface ChimericAsyncFactoryType {
  <TParams extends void, TResult = unknown, E extends Error = Error>(
    asyncFn: () => Promise<TResult>,
  ): ChimericAsync<void, TResult, E>;
  <TParams extends object, TResult = unknown, E extends Error = Error>(
    asyncFn: (params: TParams) => Promise<TResult>,
  ): ChimericAsync<TParams, TResult, E>;
}

export const ChimericAsyncFactory: ChimericAsyncFactoryType = <
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  asyncFn: TParams extends void
    ? () => Promise<TResult>
    : TParams extends object
    ? (params: TParams) => Promise<TResult>
    : never,
): ChimericAsync<TParams, TResult, E> => {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn),
  }) as ChimericAsync<TParams, TResult, E>;
};
