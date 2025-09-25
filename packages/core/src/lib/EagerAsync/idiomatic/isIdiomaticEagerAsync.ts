import { IdiomaticEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { hasIdiomaticMarker } from '../../utilities/hasIdiomaticMarker';

export const isIdiomaticEagerAsync = <TParams = void, TResult = unknown>(
  maybeIdiomaticEagerAsync: unknown,
): maybeIdiomaticEagerAsync is IdiomaticEagerAsync<TParams, TResult> => {
  return (
    isEligibleIdiomatic(maybeIdiomaticEagerAsync) &&
    hasIdiomaticMarker(
      maybeIdiomaticEagerAsync,
      TYPE_MARKERS.IDIOMATIC_EAGER_ASYNC,
    )
  );
};
