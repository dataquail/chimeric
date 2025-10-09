import { IdiomaticQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { hasIdiomaticMarker } from '../../utilities/hasIdiomaticMarker';

export const isIdiomaticQuery = <
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  maybeIdiomaticQuery: IdiomaticQuery<TParams, TResult, TNativeOptions>,
): maybeIdiomaticQuery is IdiomaticQuery<TParams, TResult, TNativeOptions> => {
  return (
    isEligibleIdiomatic(maybeIdiomaticQuery) &&
    hasIdiomaticMarker(maybeIdiomaticQuery, TYPE_MARKERS.IDIOMATIC_QUERY)
  );
};
