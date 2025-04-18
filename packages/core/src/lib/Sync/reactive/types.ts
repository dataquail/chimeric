export type ReactiveSync<TParams, TResult> = TParams extends void
  ? {
      useSync: () => TResult;
    }
  : TParams extends object
  ? {
      useSync: (params: TParams) => TResult;
    }
  : never;

export type DefineReactiveSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveSync<Parameters<T>[0], ReturnType<T>>;
