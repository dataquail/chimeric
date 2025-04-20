import { ChimericQuery } from './types';
import { isChimericQuery } from './isChimericQuery';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

// Overloads
export function fuseChimericQuery<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticQuery<undefined, TResult>;
  reactive: ReactiveQuery<undefined, TResult, E>;
}): ChimericQuery<undefined, TResult, E>;
export function fuseChimericQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult>;
  reactive: ReactiveQuery<TParams, TResult, E>;
}): ChimericQuery<TParams, TResult, E>;

// Implementation
export function fuseChimericQuery<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult>;
  reactive: ReactiveQuery<TParams, TResult, E>;
}): ChimericQuery<TParams, TResult, E> {
  const chimericFn = args.idiomatic as ChimericQuery<TParams, TResult, E>;
  chimericFn.useQuery = args.reactive.useQuery;
  if (isChimericQuery<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric query');
  }
}
