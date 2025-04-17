import { isChimericAsync } from './isChimericAsync';
import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';
import { ChimericAsync } from './types';

// Define separate implementations for void and object parameters
export function fuseChimericAsync<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<void, TResult>;
  reactive: ReactiveAsync<void, TResult, E>;
}): ChimericAsync<void, TResult, E>;
export function fuseChimericAsync<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, E>;
}): ChimericAsync<TParams, TResult, E>;

// Implementation
export function fuseChimericAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, E>;
}): ChimericAsync<TParams, TResult, E> {
  const chimericFn = args.idiomatic as ChimericAsync<TParams, TResult, E>;
  chimericFn.useAsync = args.reactive.useAsync;
  if (isChimericAsync<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric async');
  }
}
