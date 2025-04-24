import { ChimericQuery } from './types';
import { isChimericQuery } from './isChimericQuery';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';

// Overloads
export function fuseChimericQuery<
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<undefined, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    undefined,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  undefined,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
>;
export function fuseChimericQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    TParams,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  TParams,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
>;

// Implementation
export function fuseChimericQuery<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    TParams,
    TResult,
    E,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  TParams,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> {
  const chimericFn = args.idiomatic as ChimericQuery<
    TParams,
    TResult,
    E,
    TNativeIdiomaticOptions,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
  chimericFn.useQuery = args.reactive.useQuery;
  if (
    isChimericQuery<
      TParams,
      TResult,
      E,
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
