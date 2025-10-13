import { ReactiveMutation } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

export const isReactiveMutation = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveMutation: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >,
): maybeReactiveMutation is ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeInvokeOptions,
  TNativeReturnType
> => {
  return (
    isEligibleReactive(maybeReactiveMutation) &&
    hasReactiveMarker(maybeReactiveMutation, TYPE_MARKERS.REACTIVE_MUTATION)
  );
};
