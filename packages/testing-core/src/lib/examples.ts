/* eslint-disable no-async-promise-executor */
import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { JSX, ReactNode, useState } from 'react';

/******************* CORE TYPES *******************/
export type IdiomaticAsync<TParams, TResult> = TParams extends Record<
  'options',
  unknown
>
  ? never
  : TParams extends undefined
  ? (config?: { options: IdiomaticAsyncOptions }) => Promise<TResult>
  : TParams extends object
  ? (
      paramsAndConfig: TParams & { options?: IdiomaticAsyncOptions },
    ) => Promise<TResult>
  : TParams extends unknown
  ? (config?: { options: IdiomaticAsyncOptions }) => Promise<TResult>
  : never;

export type IdiomaticAsyncOptions = {
  retry?: number;
};

export type DefineIdiomaticAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>
>;

export type ReactiveAsync<
  TParams,
  TResult,
  E extends Error = Error,
> = TParams extends Record<'options', unknown>
  ? never
  : TParams extends undefined
  ? {
      useAsync: (config?: ReactiveAsyncOptions) => {
        call: () => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : TParams extends object
  ? {
      useAsync: (config?: ReactiveAsyncOptions) => {
        call: (params: TParams) => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : TParams extends unknown
  ? {
      useAsync: (config?: ReactiveAsyncOptions) => {
        call: () => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : never;

export type ReactiveAsyncOptions = {
  retry?: number;
};

export type DefineReactiveAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;

export type ChimericAsync<
  TParams,
  TResult,
  E extends Error = Error,
> = IdiomaticAsync<TParams, TResult> & ReactiveAsync<TParams, TResult, E>;

export type DefineChimericAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;

/******************* CORE UTILS *******************/
export const isIdiomaticAsync = <TParams, TResult>(
  maybeIdiomaticAsync: unknown,
): maybeIdiomaticAsync is IdiomaticAsync<TParams, TResult> => {
  return typeof maybeIdiomaticAsync === 'function';
};

export const isReactiveAsync = <TParams, TResult, E extends Error = Error>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveAsync<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'useAsync' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveAsync<TParams, TResult, E>)
      .useAsync === 'function'
  );
};

export const isChimericAsync = <TParams, TResult, E extends Error = Error>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericAsync<TParams, TResult, E> => {
  return (
    isIdiomaticAsync(maybeChimericAsync) && isReactiveAsync(maybeChimericAsync)
  );
};

export function createIdiomaticAsync<TParams, TResult>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  if (isIdiomaticAsync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic async');
  }
}

export function createReactiveAsync<TParams, TResult, E extends Error = Error>(
  reactiveFn: ReactiveAsync<TParams, TResult, E>['useAsync'],
): ReactiveAsync<TParams, TResult, E> {
  const reactiveAsync = {
    useAsync: reactiveFn,
  };
  if (isReactiveAsync<TParams, TResult, E>(reactiveAsync)) {
    return reactiveAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive async');
  }
}

export function fuseChimericAsync<
  TParams,
  TResult,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, E>;
}): ChimericAsync<TParams, TResult, E> {
  const chimericFn = args.idiomatic as ChimericAsync<TParams, TResult, E>;
  chimericFn.useAsync = args.reactive.useAsync;
  if (isChimericAsync<TParams, TResult, E>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric async');
  }
}

/******************* CORE EXAMPLES *******************/
type TestChimericWithParamsAndTypeAnnotation = DefineChimericAsync<
  (args: { name: string }) => Promise<string>
>;

const testReactiveAsync = createReactiveAsync(() => {
  return {
    call: () => Promise.resolve('test'),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
  };
});

testReactiveAsync.useAsync().call();

const testChimericWithParamsAndTypeAnnotation: TestChimericWithParamsAndTypeAnnotation =
  fuseChimericAsync({
    idiomatic: createIdiomaticAsync((args: { name: string }) =>
      Promise.resolve(args.name),
    ),
    reactive: createReactiveAsync(() => {
      return {
        call: (args: { name: string }) => Promise.resolve(args.name),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      };
    }),
  });

const testChimericResult = testChimericWithParamsAndTypeAnnotation.useAsync({
  retry: 0,
});

testChimericResult.call({ name: 'John' }).then((result) => {
  console.log(result); // string type
});

type TestChimericWithoutParamsAndTypeAnnotation = DefineChimericAsync<
  () => Promise<string>
>;

const testChimericWithoutParamsAndTypeAnnotation: TestChimericWithoutParamsAndTypeAnnotation =
  fuseChimericAsync({
    idiomatic: createIdiomaticAsync(() => Promise.resolve('test')),
    reactive: createReactiveAsync(() => {
      return {
        call: () => Promise.resolve('test'),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      };
    }),
  });

const testChimericResultWithoutParams =
  testChimericWithoutParamsAndTypeAnnotation.useAsync({
    retry: 0,
  });

testChimericResultWithoutParams.call().then((result) => {
  console.log(result); // string type
});
const testChimericWithParamsAndWithoutTypeAnnotation = fuseChimericAsync({
  idiomatic: createIdiomaticAsync((args: { name: string }) =>
    Promise.resolve(args.name),
  ),
  reactive: createReactiveAsync(() => {
    return {
      call: (args: { name: string }) => Promise.resolve(args.name),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    };
  }),
});

const testChimericResultWithParamsAndWithoutTypeAnnotation =
  testChimericWithParamsAndWithoutTypeAnnotation.useAsync({
    retry: 0,
  });

testChimericResultWithParamsAndWithoutTypeAnnotation
  .call({ name: 'John' })
  .then((result) => {
    console.log(result); // string type
  });

const testChimericWithoutParamsAndWithoutTypeAnnotation = fuseChimericAsync({
  idiomatic: createIdiomaticAsync(() => Promise.resolve('test')),
  reactive: createReactiveAsync(() => {
    return {
      call: () => Promise.resolve('test'),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    };
  }),
});

const testChimericResultWithoutParamsAndWithoutTypeAnnotation =
  testChimericWithoutParamsAndWithoutTypeAnnotation.useAsync({
    retry: 0,
  });

testChimericResultWithoutParamsAndWithoutTypeAnnotation
  .call()
  .then((result) => {
    console.log(result); // string type
  });

/******************* REACT UTILS *******************/
export const executeWithRetry = async <TResult>(
  asyncOperation: () => Promise<TResult>,
  retryCount?: number,
  initialAttempt = 0,
  lastError?: Error,
): Promise<TResult> => {
  try {
    return await asyncOperation();
  } catch (error) {
    if (retryCount === undefined) {
      throw error;
    }

    if (retryCount !== undefined && initialAttempt + 1 >= retryCount) {
      throw lastError || new Error('Max retry attempts reached');
    } else {
      // Exponential backoff: 2^attemptCount * 100ms (100, 200, 400, 800, 1600, ...)
      const delayMs = Math.min(2 ** initialAttempt * 100, 30000); // Cap at 30 seconds
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      return executeWithRetry(
        asyncOperation,
        retryCount,
        initialAttempt + 1,
        error as Error,
      );
    }
  }
};

export function IdiomaticAsyncFactory<TParams, TResult>(
  asyncFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  return ((params: TParams & { options?: IdiomaticAsyncOptions }) => {
    return executeWithRetry(() => asyncFn(params), params?.options?.retry);
  }) as IdiomaticAsync<TParams, TResult>;
}

export function ReactiveAsyncFactory<TParams, TResult, E extends Error = Error>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ReactiveAsync<TParams, TResult, E> {
  return createReactiveAsync((options?: ReactiveAsyncOptions) => {
    const [meta, setMeta] = useState<{
      isIdle: boolean;
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
      error: E | null;
      data: TResult | undefined;
    }>({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    });

    return {
      call: async (params: TParams) => {
        setMeta({
          isIdle: false,
          isPending: true,
          isSuccess: false,
          isError: false,
          error: null,
          data: undefined,
        });
        try {
          const result = await executeWithRetry<TResult>(
            () => asyncFn(params),
            options?.retry,
          );
          setMeta({
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: result,
          });
          return result;
        } catch (error) {
          setMeta({
            isIdle: false,
            isPending: false,
            isSuccess: false,
            isError: true,
            error: error as E,
            data: undefined,
          });
          throw error;
        }
      },
      isIdle: meta.isIdle,
      isPending: meta.isPending,
      isSuccess: meta.isSuccess,
      isError: meta.isError,
      error: meta.error,
      data: meta.data,
    };
  });
}

export function ChimericAsyncFactory<TParams, TResult, E extends Error = Error>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ChimericAsync<TParams, TResult, E> {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn),
  }) as ChimericAsync<TParams, TResult, E>;
}

/******************* REACT EXAMPLES *******************/

type ReactChimericWithParamsAndTypeAnnotation = DefineChimericAsync<
  (args: { name: string }) => Promise<string>
>;

const reactChimericWithParamsAndTypeAnnotation: ReactChimericWithParamsAndTypeAnnotation =
  ChimericAsyncFactory((args: { name: string }) => Promise.resolve(args.name));

const reactChimericResult = reactChimericWithParamsAndTypeAnnotation.useAsync({
  retry: 0,
});

reactChimericResult.call({ name: 'John' }).then((result) => {
  console.log(result); // string type
});

type ReactChimericWithoutParamsAndTypeAnnotation = DefineChimericAsync<
  () => Promise<string>
>;

const reactChimericWithoutParamsAndTypeAnnotation: ReactChimericWithoutParamsAndTypeAnnotation =
  ChimericAsyncFactory(() => Promise.resolve('test'));

reactChimericWithoutParamsAndTypeAnnotation.useAsync().call();

const reactChimericResultWithoutParams =
  reactChimericWithoutParamsAndTypeAnnotation.useAsync({ retry: 0 });

reactChimericResultWithoutParams.call().then((result) => {
  console.log(result); // string type
});

const reactChimericWithParamsAndWithoutTypeAnnotation = ChimericAsyncFactory(
  (args: { name: string }) => Promise.resolve(args.name),
);

const reactChimericResultWithParamsAndWithoutTypeAnnotation =
  reactChimericWithParamsAndWithoutTypeAnnotation.useAsync({ retry: 0 });

reactChimericResultWithParamsAndWithoutTypeAnnotation
  .call({ name: 'John' })
  .then((result) => {
    console.log(result); // string type
  });

const reactChimericWithoutParamsAndWithoutTypeAnnotation = ChimericAsyncFactory(
  () => Promise.resolve('test'),
);

const reactChimericResultWithoutParamsAndWithoutTypeAnnotation =
  reactChimericWithoutParamsAndWithoutTypeAnnotation.useAsync({ retry: 0 });

reactChimericResultWithoutParamsAndWithoutTypeAnnotation
  .call()
  .then((result) => {
    console.log(result); // string type
  });

/******************* REACT-TEST TYPES *******************/
export type BaseWaitForOptions = {
  timeout?: number;
  interval?: number;
};

export type WaitForReadOptions = BaseWaitForOptions & {
  reinvokeIdiomaticFn?: boolean;
};

export type AsyncTestHarnessReturnType<
  TParams,
  TResult,
  E extends Error = Error,
> = TParams extends undefined | { options: IdiomaticAsyncOptions }
  ? {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: () => Promise<TResult>;
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: E | null;
          data: TResult | undefined;
        };
      };
    }
  : {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: (params: TParams) => Promise<TResult>;
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: E | null;
          data: TResult | undefined;
        };
      };
    };

/******************* REACT-TEST UTILS *******************/

export const checkOnInterval = async (
  checkFn: () => void,
  interval: number,
  timeout: number,
  resolve: () => void,
  reject: (error: Error) => void,
) => {
  const startTime = Date.now();
  const check = async () => {
    try {
      checkFn();
      resolve();
    } catch (error) {
      if (Date.now() - startTime < timeout) {
        setTimeout(check, interval);
      } else {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };
  check();
};

export function IdiomaticAsyncTestHarness<
  TParams,
  TResult,
  E extends Error = Error,
>(args: {
  idiomaticAsync: IdiomaticAsync<TParams, TResult>;
  idiomaticOptions?: IdiomaticAsyncOptions;
}): AsyncTestHarnessReturnType<TParams, TResult, E> {
  type CallFn = (params: TParams) => Promise<TResult>;
  const result: AsyncTestHarnessReturnType<TParams, TResult, E>['result'] = {
    current: {
      call: (async (params: TParams) => {
        result.current.isIdle = false;
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        return args
          .idiomaticAsync({
            ...(params || {}),
            options: args.idiomaticOptions || {},
          } as {
            options: IdiomaticAsyncOptions;
          } & TParams & {
              options?: IdiomaticAsyncOptions;
            } & {
              options: IdiomaticAsyncOptions;
            })
          .then((data: TResult) => {
            result.current.data = data;
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = true;
            result.current.isError = false;
            result.current.error = null;
            return data;
          })
          .catch((error: unknown) => {
            result.current.isIdle = false;
            result.current.isPending = false;
            result.current.isSuccess = false;
            result.current.isError = true;
            result.current.error = error as E;
            throw error;
          });
      }) as CallFn,
      data: undefined as TResult | undefined,
      isIdle: true,
      isSuccess: false,
      isPending: false,
      isError: false,
      error: null as E | null,
    },
  };

  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        await checkOnInterval(
          cb,
          options?.interval ?? 1,
          options?.timeout ?? 3000,
          resolve,
          reject,
        );
      });
    },
    result,
  } as AsyncTestHarnessReturnType<TParams, TResult, E>;
}

export function ReactiveAsyncTestHarness<
  TParams,
  TResult,
  E extends Error = Error,
>({
  reactiveAsync,
  reactiveOptions,
  wrapper,
}: {
  reactiveAsync: ReactiveAsync<TParams, TResult, E>;
  reactiveOptions?: ReactiveAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams, TResult, E> {
  const hook = renderHook(() => reactiveAsync.useAsync(reactiveOptions ?? {}), {
    wrapper,
  });
  return {
    waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  } as AsyncTestHarnessReturnType<TParams, TResult, E>;
}

export function ChimericAsyncTestHarness<
  TParams,
  TResult,
  E extends Error = Error,
>({
  chimericAsync,
  method,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericAsync: ChimericAsync<TParams, TResult, E>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveAsyncOptions;
  idiomaticOptions?: IdiomaticAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams, TResult, E> {
  if (method === 'idiomatic') {
    return IdiomaticAsyncTestHarness({
      idiomaticAsync: chimericAsync as IdiomaticAsync<TParams, TResult>,
      idiomaticOptions,
    });
  }
  if (method === 'reactive') {
    return ReactiveAsyncTestHarness({
      reactiveAsync: chimericAsync as ReactiveAsync<TParams, TResult, E>,
      reactiveOptions,
      wrapper,
    });
  } else {
    throw new Error('Invalid method');
  }
}

/******************* REACT-TEST EXAMPLES *******************/

const idiomaticTestHarnessChimericWithParamsAndTypeAnnotation =
  ChimericAsyncTestHarness({
    chimericAsync: reactChimericWithParamsAndTypeAnnotation,
    method: 'idiomatic',
    reactiveOptions: { retry: 0 },
    idiomaticOptions: { retry: 0 },
  });

idiomaticTestHarnessChimericWithParamsAndTypeAnnotation.result.current
  .call({
    name: 'John',
  })
  .then((result) => {
    console.log(result); // string type
  });

const reactiveTestHarnessChimericWithParamsAndTypeAnnotation =
  ChimericAsyncTestHarness({
    chimericAsync: reactChimericWithParamsAndTypeAnnotation,
    method: 'reactive',
    reactiveOptions: { retry: 0 },
    idiomaticOptions: { retry: 0 },
  });

reactiveTestHarnessChimericWithParamsAndTypeAnnotation.result.current
  .call({
    name: 'John',
  })
  .then((result) => {
    console.log(result); // string type
  });

const testHarnessChimericWithoutParamsAndTypeAnnotation =
  ChimericAsyncTestHarness({
    chimericAsync: reactChimericWithoutParamsAndTypeAnnotation,
    method: 'idiomatic',
    idiomaticOptions: { retry: 0 },
  });

testHarnessChimericWithoutParamsAndTypeAnnotation.result.current
  .call()
  .then((result) => {
    console.log(result); // string type
  });

const testHarnessChimericWithParamsAndWithoutTypeAnnotation =
  ChimericAsyncTestHarness({
    chimericAsync: reactChimericWithParamsAndWithoutTypeAnnotation,
    method: 'idiomatic',
    reactiveOptions: { retry: 0 },
    idiomaticOptions: { retry: 0 },
  });

testHarnessChimericWithParamsAndWithoutTypeAnnotation.result.current
  .call({
    name: 'John',
  })
  .then((result) => {
    console.log(result); // string type
  });
