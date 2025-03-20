export type Reactive<T, E extends Error> = {
  data: T;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: E | null;
};
