import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticMutation } from './types';

export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (params: TParams, options?: TNativeOptions) => Promise<TResult>,
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
