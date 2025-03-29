export type BaseWaitForOptions = {
  timeout?: number;
  interval?: number;
};

export type WaitForReadOptions = BaseWaitForOptions & {
  reinvokeIdiomaticFn?: boolean;
};
