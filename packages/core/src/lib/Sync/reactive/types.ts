export type ReactiveSync<TParams = void, TResult = unknown> = {
  use: undefined extends TParams
    ? (params?: TParams) => TResult
    : [TParams] extends [void]
    ? () => TResult
    : (params: TParams) => TResult;
};

// export type ReactiveSync<TParams = void, TResult = unknown> = {
//   use: (params: TParams) => TResult;
// };

export type DefineReactiveSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveSync<
  Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
  ReturnType<T>
>;
