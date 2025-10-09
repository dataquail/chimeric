import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveSync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

export function createReactiveSync<TParams = void, TResult = unknown>(
  reactiveFn: (params: TParams) => TResult,
): ReactiveSync<TParams, TResult> {
  const reactiveSync = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveSync)) {
    return markReactive(
      reactiveSync,
      TYPE_MARKERS.REACTIVE_SYNC,
    ) as ReactiveSync<TParams, TResult>;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive sync');
  }
}
