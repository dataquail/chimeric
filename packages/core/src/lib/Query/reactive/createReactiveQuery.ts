import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeReturnType
  >['use'],
): ReactiveQuery<TParams, TResult, TError, TNativeOptions, TNativeReturnType> {
  const reactiveQuery = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveQuery)) {
    return markReactive(
      reactiveQuery,
      TYPE_MARKERS.REACTIVE_QUERY,
    ) as ReactiveQuery<
      TParams,
      TResult,
      TError,
      TNativeOptions,
      TNativeReturnType
    >;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
}
