import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticQuery } from './types';

export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (params: TParams, options?: TNativeOptions) => Promise<TResult>,
): IdiomaticQuery<TParams, TResult, TNativeOptions> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_QUERY,
    ) as IdiomaticQuery<TParams, TResult, TNativeOptions>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
}
