import { fuseChimericEagerAsync, type ReactiveEagerAsync } from '@chimeric/core';
import { IdiomaticEagerAsyncFactory } from './IdiomaticEagerAsyncFactory';
import { ReactiveEagerAsyncFactory } from './ReactiveEagerAsyncFactory';
import { VueChimericEagerAsync } from './types';

// Required params
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): VueChimericEagerAsync<TParams, TResult, TError>;

// Optional params
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params?: TParams) => Promise<TResult>;
}): VueChimericEagerAsync<TParams | undefined, TResult, TError>;

// No params
export function ChimericEagerAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: () => Promise<TResult>;
}): VueChimericEagerAsync<void, TResult, TError>;

// Implementation
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  eagerAsyncFn,
}: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): VueChimericEagerAsync<TParams, TResult, TError> {
  return fuseChimericEagerAsync({
    idiomatic: IdiomaticEagerAsyncFactory({ eagerAsyncFn }),
    reactive: ReactiveEagerAsyncFactory({ eagerAsyncFn }) as unknown as ReactiveEagerAsync<TParams, TResult, TError>,
  }) as unknown as VueChimericEagerAsync<TParams, TResult, TError>;
}
