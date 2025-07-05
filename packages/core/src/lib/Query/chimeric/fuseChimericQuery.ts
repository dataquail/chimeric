import { ChimericQuery } from './types';
import { isChimericQuery } from './isChimericQuery';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> {
  const chimericFn = args.idiomatic as ChimericQuery<
    TParams,
    TResult,
    TError,
    TNativeIdiomaticOptions,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
  chimericFn.use = args.reactive.use;
  if (
    isChimericQuery<
      TParams,
      TResult,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult
    >(chimericFn)
  ) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric query');
  }
}
