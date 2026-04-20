/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createReactiveEagerAsync,
  isReactiveQuery,
  isReactiveSync,
  ReactiveEagerAsync,
  ReactiveEagerAsyncOptions,
  ReactiveQueryOptions,
  ReactiveSync,
} from '@chimeric/core';
import type { QueryKey } from '@tanstack/svelte-query';
import type {
  ReactiveQuery,
  SvelteQueryReactiveNativeOptions,
} from '../../Query/reactive/types';

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

/**
 * Svelte's ReactiveSyncFactory wraps sync results in a ReactiveSyncBox<T>
 * ({ readonly current: T }).  When users write a reducer they expect to receive
 * the unwrapped T, not the box.  This helper strips the box at the type level.
 */
type UnwrapSyncBox<T> = T extends { readonly current: infer U } ? U : T;

// Extract the result type exposed to the reducer from a single service config.
type ExtractServiceResult<TConfig> = TConfig extends {
  service: ReactiveQuery<any, infer TResult, any, any>;
}
  ? TResult
  : TConfig extends {
      service: ReactiveEagerAsync<any, infer TResult, any>;
    }
  ? TResult
  : TConfig extends {
      service: ReactiveSync<any, infer TResult>;
    }
  ? UnwrapSyncBox<TResult>
  : never;

// Same as above but with | undefined for pending async services.
// Sync services are always ready so they stay non-undefined.
type ExtractServiceResultWithUndefined<TConfig> = TConfig extends {
  service: ReactiveQuery<any, infer TResult, any, any>;
}
  ? TResult | undefined
  : TConfig extends {
      service: ReactiveEagerAsync<any, infer TResult, any>;
    }
  ? TResult | undefined
  : TConfig extends {
      service: ReactiveSync<any, infer TResult>;
    }
  ? UnwrapSyncBox<TResult>
  : never;

// Tuple variants for 1–10 services.
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

// ---------------------------------------------------------------------------
// Service config types
// ---------------------------------------------------------------------------

type AnyServiceConfig = {
  service:
    | ReactiveSync<any, any>
    | ReactiveEagerAsync<any, any>
    | ReactiveQuery<any, any, any, any>;
  getParams?: (params: any) => any;
};

type QueryConfig<
  TServiceParams,
  TParams,
  TResult,
  TError extends Error,
  TQueryKey extends QueryKey,
> = [TParams] extends [void]
  ? {
      service: ReactiveQuery<void, TResult, TError, TQueryKey>;
      getParams?: never;
      getOptions?: () => {
        options?: ReactiveQueryOptions;
        nativeOptions?: SvelteQueryReactiveNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
      };
    }
  : void extends TParams
  ? {
      service: ReactiveQuery<void, TResult, TError, TQueryKey>;
      getParams?: never;
      getOptions?: () => {
        options?: ReactiveQueryOptions;
        nativeOptions?: SvelteQueryReactiveNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
      };
    }
  : undefined extends TParams
  ? {
      service: ReactiveQuery<TParams, TResult, TError, TQueryKey>;
      getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
      getOptions?:
        | ((params: TServiceParams) => {
            options?: ReactiveQueryOptions;
            nativeOptions?: SvelteQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          })
        | (() => {
            options?: ReactiveQueryOptions;
            nativeOptions?: SvelteQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          });
    }
  : {
      service: ReactiveQuery<TParams, TResult, TError, TQueryKey>;
      getParams: ((params: TServiceParams) => TParams) | (() => TParams);
      getOptions?:
        | ((params: TServiceParams) => {
            options?: ReactiveQueryOptions;
            nativeOptions?: SvelteQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          })
        | (() => {
            options?: ReactiveQueryOptions;
            nativeOptions?: SvelteQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          });
    };

type EagerAsyncConfig<
  TServiceParams,
  TParams,
  TResult,
  TError extends Error,
> = [TParams] extends [void]
  ? {
      service: ReactiveEagerAsync<void, TResult, TError>;
      getParams?: never;
      getOptions?: () => ReactiveEagerAsyncOptions;
    }
  : void extends TParams
  ? {
      service: ReactiveEagerAsync<void, TResult, TError>;
      getParams?: never;
      getOptions?: () => ReactiveEagerAsyncOptions;
    }
  : undefined extends TParams
  ? {
      service: ReactiveEagerAsync<TParams, TResult, TError>;
      getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
      getOptions?:
        | ((params: TServiceParams) => ReactiveEagerAsyncOptions)
        | (() => ReactiveEagerAsyncOptions);
    }
  : {
      service: ReactiveEagerAsync<TParams, TResult, TError>;
      getParams: ((params: TServiceParams) => TParams) | (() => TParams);
      getOptions?:
        | ((params: TServiceParams) => ReactiveEagerAsyncOptions)
        | (() => ReactiveEagerAsyncOptions);
    };

type SyncConfig<TServiceParams, TParams, TResult> = [TParams] extends [void]
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
    };

type InferService<TConfig, TServiceParams> = TConfig extends {
  service: ReactiveQuery<
    infer TParams,
    infer TResult,
    infer TError,
    infer TQueryKey
  >;
}
  ? QueryConfig<TServiceParams, TParams, TResult, TError, TQueryKey>
  : TConfig extends {
      service: ReactiveEagerAsync<infer TParams, infer TResult, infer TError>;
    }
  ? EagerAsyncConfig<TServiceParams, TParams, TResult, TError>
  : TConfig extends {
      service: ReactiveSync<infer TParams, infer TResult>;
    }
  ? SyncConfig<TServiceParams, TParams, TResult>
  : never;

// ---------------------------------------------------------------------------
// Main factory
// ---------------------------------------------------------------------------

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
    // Pre-extract useHook references once at build time.
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

    // This function is the implementation of useHook on the returned
    // ReactiveEagerAsync.  It must be called from a Svelte component's
    // reactive context (i.e. the <script> section), just like React hooks
    // must be called at the top level of a component.
    const useEagerAsync = (params: TServiceParams | void) => {
      // Call every service hook.  Svelte Query / rune-based services set up
      // their own reactive state here; the $derived below then reads those
      // reactive getters to compute the aggregated output.
      const [arg0_0, arg0_1] = getArgs(serviceList[0], params);
      const result0 = useService0(arg0_0, arg0_1);

      const [arg1_0, arg1_1] = getArgs(serviceList[1], params);
      const result1 = useService1(arg1_0, arg1_1);

      const [arg2_0, arg2_1] = getArgs(serviceList[2], params);
      const result2 = useService2(arg2_0, arg2_1);

      const [arg3_0, arg3_1] = getArgs(serviceList[3], params);
      const result3 = useService3(arg3_0, arg3_1);

      const [arg4_0, arg4_1] = getArgs(serviceList[4], params);
      const result4 = useService4(arg4_0, arg4_1);

      const [arg5_0, arg5_1] = getArgs(serviceList[5], params);
      const result5 = useService5(arg5_0, arg5_1);

      const [arg6_0, arg6_1] = getArgs(serviceList[6], params);
      const result6 = useService6(arg6_0, arg6_1);

      const [arg7_0, arg7_1] = getArgs(serviceList[7], params);
      const result7 = useService7(arg7_0, arg7_1);

      const [arg8_0, arg8_1] = getArgs(serviceList[8], params);
      const result8 = useService8(arg8_0, arg8_1);

      const [arg9_0, arg9_1] = getArgs(serviceList[9], params);
      const result9 = useService9(arg9_0, arg9_1);

      // $derived.by tracks reactive reads inside the callback:
      // - query/eagerAsync results expose reactive getters (isPending, data …)
      // - sync results expose `.current` backed by $derived
      // Any change to those signals causes this derivation to re-evaluate.
      const aggregated = $derived.by(() => {
        const results = [
          result0,
          result1,
          result2,
          result3,
          result4,
          result5,
          result6,
          result7,
          result8,
          result9,
        ].slice(0, serviceList.length);

        return computeAggregated(
          results,
          serviceList as readonly AnyServiceConfig[],
          reducer as (data: any, params: any) => TServiceResult,
          initialValueReducer as
            | ((data: any, params: any) => TServiceResult)
            | undefined,
          params,
        );
      });

      return {
        get isIdle() {
          return aggregated.isIdle;
        },
        get isPending() {
          return aggregated.isPending;
        },
        get isSuccess() {
          return aggregated.isSuccess;
        },
        get isError() {
          return aggregated.isError;
        },
        get error() {
          return aggregated.error;
        },
        get data() {
          return aggregated.data;
        },
      };
    };

    return createReactiveEagerAsync(
      useEagerAsync as ReactiveEagerAsync<
        TServiceParams,
        TServiceResult
      >['useHook'],
    );
  },
});

// ---------------------------------------------------------------------------
// Helpers (module-private)
// ---------------------------------------------------------------------------

/** Return the useHook function from a service config, or a no-op if absent. */
const getService = (
  config: AnyServiceConfig | undefined,
): (arg0?: any, arg1?: any) => any => {
  if (!config) return () => undefined;
  return config.service.useHook ?? (() => undefined);
};

/**
 * Determine the arguments to pass to a service's useHook.
 *
 * - Sync / EagerAsync: [params]
 * - Query with getParams:    [derivedParams, options]
 * - Query without getParams: [options]
 */
const getArgs = <TServiceParams>(
  config: AnyServiceConfig | undefined,
  serviceParams: TServiceParams | void,
): [] | [any] | [any, any] => {
  if (!config) return [];

  if (isReactiveQuery(config.service)) {
    const params = config.getParams
      ? config.getParams(serviceParams)
      : undefined;
    const options =
      (config as { getOptions?: (p: any) => any }).getOptions?.(params) ?? {};
    // If the caller supplied a getParams extractor the query expects params as
    // the first argument; otherwise just pass options.
    return config.getParams !== undefined ? [params, options] : [options];
  }

  // EagerAsync and Sync both receive params as their sole argument.
  const params = config.getParams ? config.getParams(serviceParams) : undefined;
  return [params];
};

/**
 * Aggregate state from all service results and run the reducer.
 *
 * - Query / EagerAsync results carry reactive `isIdle`, `isPending`, etc.
 * - Sync results (ReactiveSyncBox) are always ready; data lives at `.current`.
 */
const computeAggregated = <TServiceResult, TServiceParams>(
  results: any[],
  serviceList: readonly AnyServiceConfig[],
  reducer: (data: any, params: TServiceParams) => TServiceResult,
  initialValueReducer:
    | ((data: any, params: TServiceParams) => TServiceResult)
    | undefined,
  params: TServiceParams | void,
): {
  isIdle: boolean;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  data: TServiceResult | undefined;
} => {
  // Collect results from async services only (query / eagerAsync).
  const asyncResults = results.filter(
    (_, i) => serviceList[i] && !isReactiveSync(serviceList[i].service as any),
  );

  const aggregatedMeta = {
    isIdle:
      asyncResults.length === 0
        ? false
        : asyncResults.every((r) => r?.isIdle),
    isPending: asyncResults.some((r) => r?.isPending),
    isError: asyncResults.some((r) => r?.isError),
    isSuccess:
      asyncResults.length === 0
        ? true
        : asyncResults.every((r) => r?.isSuccess),
    error:
      (asyncResults.find((r) => r?.error)?.error as Error | undefined) ?? null,
  };

  // Extract data from each service result.
  // Sync services (ReactiveSyncBox) expose data at `.current`.
  // Async services expose data at `.data`.
  const dataList = results.map((r, i) => {
    const cfg = serviceList[i];
    if (!r || !cfg) return undefined;
    return isReactiveSync(cfg.service as any) ? r.current : r.data;
  });

  let data: TServiceResult | undefined;
  if (initialValueReducer && aggregatedMeta.isPending) {
    data = initialValueReducer(dataList, params as TServiceParams);
  } else if (!aggregatedMeta.isPending) {
    data = reducer(dataList, params as TServiceParams);
  }

  return { ...aggregatedMeta, data };
};
