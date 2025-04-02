import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type IdiomaticPromise<TParams, TResult> = (
  params: TParams,
) => Promise<TResult>;

export type ReactivePromise<TParams, TResult, E extends Error> = {
  usePromise: (
    paramsOrOptions?: ReactivePromiseParamsOrOptions<TParams>,
    optionsOrNever?: ReactivePromiseOptionsOrNever<TParams>,
  ) => {
    call: IdiomaticPromise<TParams, TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
};

export type ChimericPromise<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticPromise<TParams, TResult> & ReactivePromise<TParams, TResult, E>;

export type ReactivePromiseParamsOrOptions<TParams> = TParams extends void
  ? ReactivePromiseOptions | void
  : TParams extends ReactivePromiseOptions
  ? never
  : TParams;

export type ReactivePromiseOptionsOrNever<TParams> = TParams extends void
  ? never
  : ReactivePromiseOptions | void;

export type ReactivePromiseOptions = { invokeOnMount?: boolean };

export type DefineChimericPromise<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericPromise<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;

export type DefineIdiomaticPromise<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticPromise<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>
>;

export type DefineReactivePromise<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactivePromise<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
