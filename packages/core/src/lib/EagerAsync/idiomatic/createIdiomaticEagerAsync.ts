import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticEagerAsync } from './types';

// Required params
export function createIdiomaticEagerAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams, TResult>;

// No params
export function createIdiomaticEagerAsync<TResult = unknown>(
  idiomaticFn: () => Promise<TResult>,
): IdiomaticEagerAsync<void, TResult>;

// Optional params
export function createIdiomaticEagerAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params?: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams | undefined, TResult>;

// Implementation
export function createIdiomaticEagerAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams, TResult> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    markIdiomatic(idiomaticFn, TYPE_MARKERS.IDIOMATIC_EAGER_ASYNC);
    return idiomaticFn as IdiomaticEagerAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic eager async');
  }
}
