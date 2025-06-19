import { isChimericAsync } from './isChimericAsync';
import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';
import { ChimericAsync } from './types';

export function fuseChimericAsync<
  TParams,
  TResult,
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
