export type ReactiveSync<TParams = void, TResult = unknown> = {
  useHook: [TParams] extends [void]
    ? () => TResult
    : void extends TParams
    ? () => TResult
    : undefined extends TParams
    ? (params?: NonNullable<TParams>) => TResult
    : (params: TParams) => TResult;
};

export type DefineReactiveSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = Parameters<T> extends []
  ? ReactiveSync<void, ReturnType<T>>
  : ReactiveSync<Parameters<T>[0], ReturnType<T>>;
