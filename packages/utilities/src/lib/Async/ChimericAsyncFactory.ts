import { ChimericAsync, fuseChimericAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { ReactiveAsyncFactory } from './ReactiveAsyncFactory';

// Implement with function overloads to match the interface
export function ChimericAsyncFactory<
  TResult = unknown,
  E extends Error = Error,
>(asyncFn: () => Promise<TResult>): ChimericAsync<void, TResult, E>;
export function ChimericAsyncFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ChimericAsync<TParams, TResult, E>;

// Implementation
export function ChimericAsyncFactory<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  asyncFn: TParams extends void
    ? () => Promise<TResult>
    : (params: TParams) => Promise<TResult>,
): ChimericAsync<TParams, TResult, E> {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn),
  }) as ChimericAsync<TParams, TResult, E>;
}
