import { IdiomaticEagerAsync } from '../idiomatic/types';
import { ReactiveEagerAsync } from '../reactive/types';
import { isChimericEagerAsync } from './isChimericEagerAsync';
import { ChimericEagerAsync } from './types';

export function fuseChimericEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<TParams, TResult>;
  reactive: ReactiveEagerAsync<TParams, TResult, TError>;
}): ChimericEagerAsync<TParams, TResult, TError> {
  const chimericFn = args.idiomatic as ChimericEagerAsync<
    TParams,
    TResult,
    TError
  >;
  chimericFn.useEagerAsync = args.reactive.useEagerAsync;
  if (isChimericEagerAsync<TParams, TResult, TError>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric eager async');
  }
}
