import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticMutation } from './types';

// Overload for no params
export function createIdiomaticMutation<
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticMutation<void, TResult, TNativeOptions>,
): IdiomaticMutation<void, TResult, TNativeOptions>;

// Overload for optional params
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticMutation<TParams | undefined, TResult, TNativeOptions>,
): IdiomaticMutation<TParams | undefined, TResult, TNativeOptions>;

// Overload for required params
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticMutation<TParams, TResult, TNativeOptions>,
): IdiomaticMutation<TParams, TResult, TNativeOptions>;

// Implementation
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticMutation<TParams, TResult, TNativeOptions>,
): IdiomaticMutation<TParams, TResult, TNativeOptions> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_MUTATION,
    ) as IdiomaticMutation<TParams, TResult, TNativeOptions>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic mutation');
  }
}
