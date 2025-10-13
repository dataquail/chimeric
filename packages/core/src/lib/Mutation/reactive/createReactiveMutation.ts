import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveMutation } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

// Overload for no params
export function createReactiveMutation<
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    void,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >['use'],
): ReactiveMutation<
  void,
  TResult,
  TError,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReturnType
>;

// Overload for optional params
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams | undefined,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >['use'],
): ReactiveMutation<
  TParams | undefined,
  TResult,
  TError,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReturnType
>;

// Overload for required params
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >['use'],
): ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReturnType
>;

// Implementation
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >['use'],
): ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeReactiveOptions,
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
      TNativeReactiveOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
}
