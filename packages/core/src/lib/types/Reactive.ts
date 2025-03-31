export type Reactive<T, E extends Error> = {
  data: T;
  isIdle: boolean;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: E | null;
};
