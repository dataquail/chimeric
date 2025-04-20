export type ReactiveSync<TParams, TResult> = TParams extends undefined
  ? {
      useSync: () => TResult;
    }
  : {
      useSync: (params: TParams) => TResult;
    };

export type DefineReactiveSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveSync<Parameters<T>[0], ReturnType<T>>;
