import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveMutation } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >['use'],
): ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeInvokeOptions,
  TNativeReturnType
> {
  const reactiveMutation = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveMutation)) {
    return markReactive(
      reactiveMutation,
      TYPE_MARKERS.REACTIVE_MUTATION,
    ) as ReactiveMutation<
      TParams,
      TResult,
      TError,
      TNativeOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
}
