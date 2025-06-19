export type ReactiveSync<TParams, TResult> = TParams extends undefined
  ? {
      useSync: () => TResult;
    }
  : TParams extends object
  ? {
      useSync: (params: TParams) => TResult;
    }
  : TParams extends unknown
  ? {
      useSync: () => TResult;
    }
  : never;

export type DefineReactiveSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveSync<Parameters<T>[0], ReturnType<T>>;
