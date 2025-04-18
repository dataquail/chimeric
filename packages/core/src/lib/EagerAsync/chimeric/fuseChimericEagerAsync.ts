import { IdiomaticEagerAsync } from '../idiomatic/types';
import { ReactiveEagerAsync } from '../reactive/types';
import { isChimericEagerAsync } from './isChimericEagerAsync';
import { ChimericEagerAsync } from './types';

// Define separate implementations for void and object parameters
export function fuseChimericEagerAsync<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<void, TResult>;
  reactive: ReactiveEagerAsync<void, TResult, E>;
}): ChimericEagerAsync<void, TResult, E>;
export function fuseChimericEagerAsync<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<TParams, TResult>;
  reactive: ReactiveEagerAsync<TParams, TResult, E>;
}): ChimericEagerAsync<TParams, TResult, E>;

// Implementation
export function fuseChimericEagerAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<TParams, TResult>;
  reactive: ReactiveEagerAsync<TParams, TResult, E>;
}): ChimericEagerAsync<TParams, TResult, E> {
  const chimericFn = args.idiomatic as ChimericEagerAsync<TParams, TResult, E>;
  chimericFn.useEagerAsync = args.reactive.useEagerAsync;
  if (isChimericEagerAsync<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric eager async');
  }
}
