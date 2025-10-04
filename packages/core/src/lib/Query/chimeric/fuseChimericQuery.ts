import { ChimericQuery } from './types';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticQuery } from '../idiomatic/isIdiomaticQuery';
import { isReactiveQuery } from '../reactive/isReactiveQuery';

// Overload for no params
export function fuseChimericQuery<
  TResult,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<void, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    void,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  void,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
>;

// Overload for optional params
export function fuseChimericQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<
    TParams | undefined,
    TResult,
    TNativeIdiomaticOptions
  >;
  reactive: ReactiveQuery<
    TParams | undefined,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  TParams | undefined,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
>;

// Overload for required params
export function fuseChimericQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
>;

// Implementation
export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: any;
  reactive: any;
}): ChimericQuery<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> {
  if (isIdiomaticQuery(args.idiomatic) && isReactiveQuery(args.reactive)) {
    const chimericFn = args.idiomatic as ChimericQuery<
      TParams,
      TResult,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult
    >;
    (chimericFn.use as any) = args.reactive.use;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_QUERY);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_QUERY);

    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric query');
  }
}
