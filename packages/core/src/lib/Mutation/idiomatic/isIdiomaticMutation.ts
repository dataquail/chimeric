import { IdiomaticMutation } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { hasIdiomaticMarker } from '../../utilities/hasIdiomaticMarker';

export const isIdiomaticMutation = <
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  maybeIdiomaticMutation: IdiomaticMutation<TParams, TResult, TNativeOptions>,
): maybeIdiomaticMutation is IdiomaticMutation<
  TParams,
  TResult,
  TNativeOptions
> => {
  return (
    isEligibleIdiomatic(maybeIdiomaticMutation) &&
    hasIdiomaticMarker(maybeIdiomaticMutation, TYPE_MARKERS.IDIOMATIC_MUTATION)
  );
};
