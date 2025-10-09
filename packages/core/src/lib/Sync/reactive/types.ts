export type ReactiveSync<TParams = void, TResult = unknown> = {
  use: [TParams] extends [void]
    ? () => TResult
    : void extends TParams
    ? () => TResult
    : undefined extends TParams
    ? (params?: TParams) => TResult
    : (params: TParams) => TResult;
};

export type DefineReactiveSync<T extends (...args: any[]) => any> =
  Parameters<T> extends []
    ? ReactiveSync<void, ReturnType<T>>
    : ReactiveSync<Parameters<T>[0], ReturnType<T>>;
