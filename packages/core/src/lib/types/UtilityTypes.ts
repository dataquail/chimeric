// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractChimericParameter<T> = T extends (...args: infer U) => any
  ? U[0] extends undefined
    ? void
    : U[0]
  : void;

export type ExtractChimericPromiseReturnType<T> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

export type ExtractChimericReturnType<T> = T extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => infer R
  ? R
  : never;
