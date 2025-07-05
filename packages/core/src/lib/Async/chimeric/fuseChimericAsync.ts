import { isChimericAsync } from './isChimericAsync';
import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';
import { ChimericAsync } from './types';

export function fuseChimericAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, TError>;
}): ChimericAsync<TParams, TResult, TError> {
  const chimericFn = args.idiomatic as ChimericAsync<TParams, TResult, TError>;
  chimericFn.use = args.reactive.use;
  if (isChimericAsync<TParams, TResult, TError>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric async');
  }
}
