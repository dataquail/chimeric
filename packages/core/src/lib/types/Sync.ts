export type IdiomaticSync<TParams, TResult> = TParams extends void
  ? () => TResult
  : TParams extends object
  ? (params: TParams) => TResult
  : never;

export type ReactiveSync<TParams, TResult> = TParams extends void
  ? {
      useSync: () => TResult;
    }
  : TParams extends object
  ? {
      useSync: (params: TParams) => TResult;
    }
  : never;

export type ChimericSync<TParams, TResult> = IdiomaticSync<TParams, TResult> &
  ReactiveSync<TParams, TResult>;

export type DefineChimericSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ChimericSync<Parameters<T>[0], Awaited<ReturnType<T>>>;

export type DefineIdiomaticSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = IdiomaticSync<Parameters<T>[0], Awaited<ReturnType<T>>>;

export type DefineReactiveRead<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveSync<Parameters<T>[0], Awaited<ReturnType<T>>>;
