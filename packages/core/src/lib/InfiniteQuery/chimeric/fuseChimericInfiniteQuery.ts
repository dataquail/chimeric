import { ChimericInfiniteQuery } from './types';
import { IdiomaticInfiniteQuery } from '../idiomatic/types';
import { ReactiveInfiniteQuery } from '../reactive/types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticInfiniteQuery } from '../idiomatic/isIdiomaticInfiniteQuery';
import { isReactiveInfiniteQuery } from '../reactive/isReactiveInfiniteQuery';

// No params
export function fuseChimericInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TNativeIdiomaticOptions
  >;
  reactive: ReactiveInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult,
    TNativeReactivePrefetchOptions
  >;
}): ChimericInfiniteQuery<
  void,
  TPageData,
  TPageParam,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult,
  TNativeReactivePrefetchOptions
>;

// Optional params
export function fuseChimericInfiniteQuery<
  TParams,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TNativeIdiomaticOptions
  >;
  reactive: ReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult,
    TNativeReactivePrefetchOptions
  >;
}): ChimericInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult,
  TNativeReactivePrefetchOptions
>;

// Required params
export function fuseChimericInfiniteQuery<
  TParams,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TNativeIdiomaticOptions
  >;
  reactive: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult,
    TNativeReactivePrefetchOptions
  >;
}): ChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult,
  TNativeReactivePrefetchOptions
>;

// Implementation
export function fuseChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
  TNativeReactivePrefetchOptions = unknown,
>(args: {
  idiomatic: any;
  reactive: any;
}): ChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult,
  TNativeReactivePrefetchOptions
> {
  if (
    isIdiomaticInfiniteQuery(args.idiomatic) &&
    isReactiveInfiniteQuery(args.reactive)
  ) {
    const chimericFn = args.idiomatic as ChimericInfiniteQuery<
      TParams,
      TPageData,
      TPageParam,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult,
      TNativeReactivePrefetchOptions
    >;
    (chimericFn.useHook as any) = args.reactive.useHook;
    (chimericFn.usePrefetchHook as any) = args.reactive.usePrefetchHook;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_INFINITE_QUERY);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_INFINITE_QUERY);

    return chimericFn;
  } else {
    throw new Error(
      'chimericFn is not qualified to be chimeric infinite query',
    );
  }
}
