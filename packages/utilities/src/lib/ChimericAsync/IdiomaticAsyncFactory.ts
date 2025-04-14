import { IdiomaticAsync, isIdiomaticAsync } from '@chimeric/core';

export const IdiomaticAsyncFactory = <TParams = void, TResult = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncFn: TParams extends Record<'options', any>
    ? never
    : TParams extends void
    ? () => Promise<TResult>
    : (params: TParams) => Promise<TResult>,
): IdiomaticAsync<
  Parameters<typeof asyncFn>[0],
  Awaited<ReturnType<typeof asyncFn>>
> => {
  if (
    isIdiomaticAsync<
      Parameters<typeof asyncFn>[0],
      Awaited<ReturnType<typeof asyncFn>>
    >(asyncFn)
  ) {
    return asyncFn;
  } else {
    throw new Error('asyncFn is not qualified to be idiomatic async');
  }
};
