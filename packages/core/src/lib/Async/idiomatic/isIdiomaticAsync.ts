import { IdiomaticAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { hasIdiomaticMarker } from '../../utilities/hasIdiomaticMarker';

export const isIdiomaticAsync = <TParams = void, TResult = unknown>(
  maybeIdiomaticAsync: unknown,
): maybeIdiomaticAsync is IdiomaticAsync<TParams, TResult> => {
  return (
    isEligibleIdiomatic(maybeIdiomaticAsync) &&
    hasIdiomaticMarker(
      maybeIdiomaticAsync,
      TYPE_MARKERS.IDIOMATIC_ASYNC,
    )
  );
};
