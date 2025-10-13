import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { ChimericMutation } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticMutation } from '../idiomatic/isIdiomaticMutation';
import { isReactiveMutation } from '../reactive/isReactiveMutation';

// Overload for no params
export function fuseChimericMutation<
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<void, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    void,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  void,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReactiveReturnType
>;

// Overload for optional params
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<
    TParams | undefined,
    TResult,
    TNativeIdiomaticOptions
  >;
  reactive: ReactiveMutation<
    TParams | undefined,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  TParams | undefined,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReactiveReturnType
>;

// Overload for required params
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReactiveReturnType
>;

// Implementation
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReactiveReturnType = unknown,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReactiveReturnType
  >;
}): ChimericMutation<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeInvokeOptions,
  TNativeReactiveReturnType
> {
  if (
    isIdiomaticMutation(args.idiomatic) &&
    isReactiveMutation(args.reactive)
  ) {
    const chimericFn = args.idiomatic as ChimericMutation<
      TParams,
      TResult,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeInvokeOptions,
      TNativeReactiveReturnType
    >;
    chimericFn.use = args.reactive.use;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_MUTATION);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_MUTATION);

    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric mutation');
  }
}
