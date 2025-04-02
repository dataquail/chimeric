import {
  ExtractChimericParameter,
  ExtractChimericReturnType,
} from './UtilityTypes.js';

export type IdiomaticRead<TParams, TResult> = (params: TParams) => TResult;

export type ReactiveRead<TParams, TResult> = {
  use: (params: TParams) => TResult;
};

export type ChimericRead<TParams, TResult> = IdiomaticRead<TParams, TResult> &
  ReactiveRead<TParams, TResult>;

export type DefineChimericRead<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ChimericRead<ExtractChimericParameter<T>, ExtractChimericReturnType<T>>;

export type DefineIdiomaticRead<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = IdiomaticRead<ExtractChimericParameter<T>, ExtractChimericReturnType<T>>;

export type DefineReactiveRead<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveRead<ExtractChimericParameter<T>, ExtractChimericReturnType<T>>;
