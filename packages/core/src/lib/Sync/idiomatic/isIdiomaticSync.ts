import { IdiomaticSync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { hasIdiomaticMarker } from '../../utilities/hasIdiomaticMarker';

export const isIdiomaticSync = <TParams = void, TResult = unknown>(
  maybeIdiomaticSync: unknown,
): maybeIdiomaticSync is IdiomaticSync<TParams, TResult> => {
  return (
    isEligibleIdiomatic(maybeIdiomaticSync) &&
    hasIdiomaticMarker(
      maybeIdiomaticSync,
      TYPE_MARKERS.IDIOMATIC_SYNC,
    )
  );
};
