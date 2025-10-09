/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createReactiveEagerAsync,
  isReactiveEagerAsync,
  isReactiveQuery,
  isReactiveSync,
  ReactiveEagerAsync,
  ReactiveQueryOptions,
  ReactiveSync,
} from '@chimeric/core';
import { UseQueryResult } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import {
  ReactiveQuery,
  TanstackQueryReactiveNativeOptions,
} from '../../Query/reactive/types';
import {
  ExtractTResultExtends,
  MetaAggregatorFactory,
} from '../MetaAggregatorFactory';

// Helper type to extract the result type from a service configuration
type ExtractServiceResult<TConfig> = TConfig extends {
  service: ReactiveQuery<
    infer _TParams,
    infer TResult,
    infer _TError,
    infer _TQueryKey
  >;
}
  ? TResult
  : TConfig extends {
      service: ReactiveEagerAsync<any, infer TResult, infer _TError>;
    }
  ? TResult
  : TConfig extends {
      service: ReactiveSync<infer _TParams, infer TResult>;
    }
  ? TResult
  : never;

type ExtractServiceResultWithUndefined<TConfig> = TConfig extends {
  service: ReactiveQuery<any, infer TResult, infer TError, any>;
}
  ? UseQueryResult<TResult, TError>['data'] | undefined
  : TConfig extends {
      service: ReactiveEagerAsync<any, infer TResult, any>;
    }
  ? TResult | undefined
  : TConfig extends {
      service: ReactiveSync<any, infer TResult>;
    }
  ? TResult
  : never;

// Type to extract results from a tuple of configs
type ExtractResults<T extends readonly any[]> = T extends readonly [infer C0]
  ? [ExtractServiceResult<C0>]
  : T extends readonly [infer C0, infer C1]
  ? [ExtractServiceResult<C0>, ExtractServiceResult<C1>]
  : T extends readonly [infer C0, infer C1, infer C2]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
    ]
  : T extends readonly [infer C0, infer C1, infer C2, infer C3]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
    ]
  : T extends readonly [infer C0, infer C1, infer C2, infer C3, infer C4]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
      infer C7,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
      ExtractServiceResult<C7>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
      infer C7,
      infer C8,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
      ExtractServiceResult<C7>,
      ExtractServiceResult<C8>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
      infer C7,
      infer C8,
      infer C9,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
      ExtractServiceResult<C7>,
      ExtractServiceResult<C8>,
      ExtractServiceResult<C9>,
    ]
  : never;

type ExtractResultsWithUndefined<T extends readonly any[]> =
  T extends readonly [infer C0]
    ? [ExtractServiceResultWithUndefined<C0>]
    : T extends readonly [infer C0, infer C1]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
      ]
    : T extends readonly [infer C0, infer C1, infer C2]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
      ]
    : T extends readonly [infer C0, infer C1, infer C2, infer C3]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
      ]
    : T extends readonly [infer C0, infer C1, infer C2, infer C3, infer C4]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
        ExtractServiceResultWithUndefined<C4>,
      ]
    : T extends readonly [
        infer C0,
        infer C1,
        infer C2,
        infer C3,
        infer C4,
        infer C5,
      ]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
        ExtractServiceResultWithUndefined<C4>,
        ExtractServiceResultWithUndefined<C5>,
      ]
    : T extends readonly [
        infer C0,
        infer C1,
        infer C2,
        infer C3,
        infer C4,
        infer C5,
        infer C6,
      ]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
        ExtractServiceResultWithUndefined<C4>,
        ExtractServiceResultWithUndefined<C5>,
        ExtractServiceResultWithUndefined<C6>,
      ]
    : T extends readonly [
        infer C0,
        infer C1,
        infer C2,
        infer C3,
        infer C4,
        infer C5,
        infer C6,
        infer C7,
      ]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
        ExtractServiceResultWithUndefined<C4>,
        ExtractServiceResultWithUndefined<C5>,
        ExtractServiceResultWithUndefined<C6>,
        ExtractServiceResultWithUndefined<C7>,
      ]
    : T extends readonly [
        infer C0,
        infer C1,
        infer C2,
        infer C3,
        infer C4,
        infer C5,
        infer C6,
        infer C7,
        infer C8,
      ]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
        ExtractServiceResultWithUndefined<C4>,
        ExtractServiceResultWithUndefined<C5>,
        ExtractServiceResultWithUndefined<C6>,
        ExtractServiceResultWithUndefined<C7>,
        ExtractServiceResultWithUndefined<C8>,
      ]
    : T extends readonly [
        infer C0,
        infer C1,
        infer C2,
        infer C3,
        infer C4,
        infer C5,
        infer C6,
        infer C7,
        infer C8,
        infer C9,
      ]
    ? [
        ExtractServiceResultWithUndefined<C0>,
        ExtractServiceResultWithUndefined<C1>,
        ExtractServiceResultWithUndefined<C2>,
        ExtractServiceResultWithUndefined<C3>,
        ExtractServiceResultWithUndefined<C4>,
        ExtractServiceResultWithUndefined<C5>,
        ExtractServiceResultWithUndefined<C6>,
        ExtractServiceResultWithUndefined<C7>,
        ExtractServiceResultWithUndefined<C8>,
        ExtractServiceResultWithUndefined<C9>,
      ]
    : never;

type AnyServiceConfig = {
  service:
    | ReactiveSync<any, any>
    | ReactiveEagerAsync<any, any>
    | ReactiveQuery<any, any>;
  getParams?: (params: any) => any;
};

type NoParamsEagerAsyncServiceConfig = {
  service: ReactiveEagerAsync<void, any, any>;
};
type WithParamsEagerAsyncServiceConfig = {
  service: ReactiveEagerAsync<any, any, any>;
  getParams: (params: any) => any;
};

type NoParamsQueryServiceConfig = {
  service: ReactiveQuery<void, any, any, any>;
};
type WithParamsQueryServiceConfig = {
  service: ReactiveQuery<any, any, any, any>;
  getParams: (params: any) => any;
};

type InferService<TConfig, TServiceParams> =
  TConfig extends NoParamsQueryServiceConfig
    ? TConfig['service'] extends ReactiveQuery<
        void,
        infer TResult,
        infer TError,
        infer TQueryKey
      >
      ? {
          service: ReactiveQuery<void, TResult, TError, TQueryKey>;
          getParams?: never;
          getOptions?: () => {
            options?: ReactiveQueryOptions;
            nativeOptions?: TanstackQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          };
        }
      : never
    : TConfig extends WithParamsQueryServiceConfig
    ? TConfig['service'] extends ReactiveQuery<
        infer TParams,
        infer TResult,
        infer TError,
        infer TQueryKey
      >
      ? {
          service: ReactiveQuery<TParams, TResult, TError, TQueryKey>;
          getParams: (params: TServiceParams) => TParams;
          getOptions?: (params: TServiceParams) => {
            options?: ReactiveQueryOptions;
            nativeOptions?: TanstackQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          };
        }
      : never
    : TConfig extends NoParamsEagerAsyncServiceConfig
    ? TConfig['service'] extends ReactiveEagerAsync<
        void,
        infer TResult,
        infer TError
      >
      ? {
          service: ReactiveEagerAsync<void, TResult, TError>;
          getParams?: never;
          getOptions?: never;
        }
      : never
    : TConfig extends WithParamsEagerAsyncServiceConfig
    ? TConfig['service'] extends ReactiveEagerAsync<
        infer TParams,
        infer TResult,
        infer TError
      >
      ? {
          service: ReactiveEagerAsync<TParams, TResult, TError>;
          getParams: (params: TServiceParams) => TParams;
          getOptions?: never;
        }
      : never
    : TConfig extends {
        service: ReactiveSync<infer TParams, infer TResult>;
      }
    ? [TParams] extends [void]
      ? {
          service: ReactiveSync<void, TResult>;
          getParams?: never;
          getOptions?: never;
        }
      : void extends TParams
      ? {
          service: ReactiveSync<void, TResult>;
          getParams?: never;
          getOptions?: never;
        }
      : undefined extends TParams
      ? {
          service: ReactiveSync<TParams, TResult>;
          getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
          getOptions?: never;
        }
      : {
          service: ReactiveSync<TParams, TResult>;
          getParams: ((params: TServiceParams) => TParams) | (() => TParams);
          getOptions?: never;
        }
    : never;

export const ReactiveAsyncReducer = <TServiceParams = void>() => ({
  build: <
    TServiceResult,
    TConfigList extends
      | readonly [InferService<TConfigList[0], TServiceParams>]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
          InferService<TConfigList[7], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
          InferService<TConfigList[7], TServiceParams>,
          InferService<TConfigList[8], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
          InferService<TConfigList[7], TServiceParams>,
          InferService<TConfigList[8], TServiceParams>,
          InferService<TConfigList[9], TServiceParams>,
        ],
  >({
    reducer,
    initialValueReducer,
    serviceList,
  }: {
    serviceList: TConfigList;
    reducer: (
      args: ExtractResults<TConfigList>,
      serviceParams: TServiceParams,
    ) => TServiceResult;
    initialValueReducer?: (
      args: ExtractResultsWithUndefined<TConfigList>,
      serviceParams: TServiceParams,
    ) => TServiceResult;
  }): ReactiveEagerAsync<TServiceParams, TServiceResult> => {
    const useService0 = getService(serviceList[0]);
    const useService1 = getService(serviceList[1]);
    const useService2 = getService(serviceList[2]);
    const useService3 = getService(serviceList[3]);
    const useService4 = getService(serviceList[4]);
    const useService5 = getService(serviceList[5]);
    const useService6 = getService(serviceList[6]);
    const useService7 = getService(serviceList[7]);
    const useService8 = getService(serviceList[8]);
    const useService9 = getService(serviceList[9]);

    const useEagerAsync = (params: TServiceParams | void) => {
      // Memoize arguments
      const args0 = useMemo(() => getArgs(serviceList[0], params), [params]);
      const args1 = useMemo(() => getArgs(serviceList[1], params), [params]);
      const args2 = useMemo(() => getArgs(serviceList[2], params), [params]);
      const args3 = useMemo(() => getArgs(serviceList[3], params), [params]);
      const args4 = useMemo(() => getArgs(serviceList[4], params), [params]);
      const args5 = useMemo(() => getArgs(serviceList[5], params), [params]);
      const args6 = useMemo(() => getArgs(serviceList[6], params), [params]);
      const args7 = useMemo(() => getArgs(serviceList[7], params), [params]);
      const args8 = useMemo(() => getArgs(serviceList[8], params), [params]);
      const args9 = useMemo(() => getArgs(serviceList[9], params), [params]);

      // Call hooks with memoized arguments
      const result0 = useService0(args0);
      const result1 = useService1(args1);
      const result2 = useService2(args2);
      const result3 = useService3(args3);
      const result4 = useService4(args4);
      const result5 = useService5(args5);
      const result6 = useService6(args6);
      const result7 = useService7(args7);
      const result8 = useService8(args8);
      const result9 = useService9(args9);

      // Use deep memoization for each result to prevent unnecessary re-renders
      const memoizedResult0 = useDeepMemo(
        extractMemoKey(result0, serviceList[0]),
      );
      const memoizedResult1 = useDeepMemo(
        extractMemoKey(result1, serviceList[1]),
      );
      const memoizedResult2 = useDeepMemo(
        extractMemoKey(result2, serviceList[2]),
      );
      const memoizedResult3 = useDeepMemo(
        extractMemoKey(result3, serviceList[3]),
      );
      const memoizedResult4 = useDeepMemo(
        extractMemoKey(result4, serviceList[4]),
      );
      const memoizedResult5 = useDeepMemo(
        extractMemoKey(result5, serviceList[5]),
      );
      const memoizedResult6 = useDeepMemo(
        extractMemoKey(result6, serviceList[6]),
      );
      const memoizedResult7 = useDeepMemo(
        extractMemoKey(result7, serviceList[7]),
      );
      const memoizedResult8 = useDeepMemo(
        extractMemoKey(result8, serviceList[8]),
      );
      const memoizedResult9 = useDeepMemo(
        extractMemoKey(result9, serviceList[9]),
      );

      // Memoize the final result to avoid unnecessary recalculations
      return useMemo(() => {
        const results = [
          memoizedResult0,
          memoizedResult1,
          memoizedResult2,
          memoizedResult3,
          memoizedResult4,
          memoizedResult5,
          memoizedResult6,
          memoizedResult7,
          memoizedResult8,
          memoizedResult9,
        ].slice(0, serviceList.length);
        return MetaAggregatorFactory({
          metaList: results as ExtractTResultExtends<any[]>,
          dataReducer: (dataList) =>
            reducer(
              dataList as ExtractResults<TConfigList>,
              params as TServiceParams,
            ),
          context: params as TServiceParams,
          initialValueReducer: initialValueReducer as any,
        });
      }, [
        memoizedResult0,
        memoizedResult1,
        memoizedResult2,
        memoizedResult3,
        memoizedResult4,
        memoizedResult5,
        memoizedResult6,
        memoizedResult7,
        memoizedResult8,
        memoizedResult9,
        params,
      ]);
    };

    return createReactiveEagerAsync<TServiceParams, TServiceResult>(
      useEagerAsync as ReactiveEagerAsync<
        TServiceParams,
        TServiceResult
      >['use'],
    );
  },
});

const getService = (service: AnyServiceConfig | undefined) => {
  if (!service) {
    return () => undefined;
  } else {
    return service.service.use || (() => undefined);
  }
};

// Deep comparison utility for nested objects
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
};

// Custom hook for memoization with deep comparison
const useDeepMemo = <T>(value: T): T => {
  const ref = useRef<T>(value);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

export const extractMemoKey = (
  result: any,
  serviceConfig: AnyServiceConfig | undefined,
) => {
  if (!result || !serviceConfig) {
    return result;
  }

  if (isReactiveSync(serviceConfig.service)) {
    // For sync services, the result is the data directly - safe to memoize as-is
    return result;
  } else if (isReactiveEagerAsync(serviceConfig.service)) {
    // For eager async services, extract only the relevant state properties
    return {
      isIdle: result.isIdle,
      isPending: result.isPending,
      isSuccess: result.isSuccess,
      isError: result.isError,
      data: result.data,
      error: result.error,
    };
  } else if (isReactiveQuery(serviceConfig.service)) {
    // For query services, extract only the relevant state properties
    return {
      isIdle: result.isIdle,
      isPending: result.isPending,
      isSuccess: result.isSuccess,
      isError: result.isError,
      data: result.data,
      error: result.error,
    };
  } else {
    return result;
  }
};

const getArgs = <TServiceParams>(
  service: AnyServiceConfig | undefined,
  serviceParams: TServiceParams | void,
) => {
  if (!service) {
    return undefined;
  }

  // Get params either from getParams function or undefined for void services
  const params = service?.getParams
    ? service.getParams(serviceParams)
    : undefined;

  if (isReactiveSync(service.service)) {
    return params;
  } else if (isReactiveEagerAsync(service.service)) {
    return params;
  } else if (isReactiveQuery(service.service)) {
    const options =
      (service as { getOptions?: (serviceParams: any) => void })?.getOptions?.(
        params,
      ) ?? {};
    return {
      ...params,
      ...options,
    };
  } else {
    throw new Error('Invalid service type');
  }
};
