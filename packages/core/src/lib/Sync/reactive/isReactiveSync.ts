import { ReactiveSync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

export const isReactiveSync = <TParams = void, TResult = unknown>(
  maybeReactiveSync: unknown,
): maybeReactiveSync is ReactiveSync<TParams, TResult> => {
  return (
    isEligibleReactive(maybeReactiveSync) &&
    hasReactiveMarker(maybeReactiveSync, TYPE_MARKERS.REACTIVE_SYNC)
  );
};
