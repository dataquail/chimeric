import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticQuery } from './types';

// Overload for no params (allOptions as first arg)
export function createIdiomaticQuery<TResult, TNativeOptions = unknown>(
  idiomaticFn: (allOptions?: {
    options?: { forceRefetch?: boolean };
    nativeOptions?: TNativeOptions;
  }) => Promise<TResult>,
): IdiomaticQuery<void, TResult, TNativeOptions>;

// Overload for optional params (params as first arg, allOptions as second)
export function createIdiomaticQuery<
  TParams,
  TResult,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params?: TParams,
    allOptions?: {
      options?: { forceRefetch?: boolean };
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<TResult>,
): IdiomaticQuery<TParams | undefined, TResult, TNativeOptions>;

// Overload for required params (params as first arg, allOptions as second)
export function createIdiomaticQuery<
  TParams,
  TResult,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params: TParams,
    allOptions?: {
      options?: { forceRefetch?: boolean };
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<TResult>,
): IdiomaticQuery<TParams, TResult, TNativeOptions>;

// Implementation
export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(idiomaticFn: any): IdiomaticQuery<TParams, TResult, TNativeOptions> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_QUERY,
    ) as IdiomaticQuery<TParams, TResult, TNativeOptions>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
}
