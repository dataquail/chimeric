import { ChimericEagerAsync, fuseChimericEagerAsync } from '@chimeric/core';
import { IdiomaticEagerAsyncFactory } from './IdiomaticEagerAsyncFactory';
import { ReactiveEagerAsyncFactory } from './ReactiveEagerAsyncFactory';

// Required params
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ChimericEagerAsync<TParams, TResult, TError>;

// Optional params
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params?: TParams) => Promise<TResult>;
}): ChimericEagerAsync<TParams | undefined, TResult, TError>;

// No params
export function ChimericEagerAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: () => Promise<TResult>;
}): ChimericEagerAsync<void, TResult, TError>;

// Implementation
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  eagerAsyncFn,
}: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ChimericEagerAsync<TParams, TResult, TError> {
  return fuseChimericEagerAsync({
    idiomatic: IdiomaticEagerAsyncFactory({ eagerAsyncFn }),
    reactive: ReactiveEagerAsyncFactory({ eagerAsyncFn }),
  });
}
