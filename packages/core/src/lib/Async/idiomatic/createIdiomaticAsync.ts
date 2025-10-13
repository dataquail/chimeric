import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticAsync } from './types';

// Required params
export function createIdiomaticAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult>;

// No params
export function createIdiomaticAsync<TResult = unknown>(
  idiomaticFn: () => Promise<TResult>,
): IdiomaticAsync<void, TResult>;

// Optional params
export function createIdiomaticAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params?: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams | undefined, TResult>;

// Implementation
export function createIdiomaticAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    markIdiomatic(idiomaticFn, TYPE_MARKERS.IDIOMATIC_ASYNC);
    return idiomaticFn as IdiomaticAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic async');
  }
}
