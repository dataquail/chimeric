/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChimericEagerAsync,
  ChimericSync,
  fuseChimericEagerAsync,
  IdiomaticEagerAsync,
  IdiomaticQueryOptions,
  ReactiveEagerAsync,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { UseQueryResult } from '@tanstack/react-query';
import { IdiomaticAsyncReducer } from './IdiomaticAsyncReducer';
import { ReactiveAsyncReducer } from './ReactiveAsyncReducer';
import { TanstackQueryIdiomaticNativeOptions } from 'src/lib/Query/idiomatic/types';
import { ChimericQuery } from 'src/lib/Query/chimeric/types';
import { TanstackQueryReactiveNativeOptions } from 'src/lib/Query/reactive/types';

// Helper type to extract the result type from a service configuration
type ExtractServiceResult<TConfig> = TConfig extends {
  service: ChimericQuery<any, infer TResult, infer TError, any>;
}
  ? UseQueryResult<TResult, TError>['data']
  : TConfig extends {
      service: ChimericEagerAsync<any, infer TResult, any>;
    }
  ? TResult
  : TConfig extends {
      service: ChimericSync<any, infer TResult>;
    }
  ? TResult
  : never;

type ExtractServiceResultWithUndefined<TConfig> = TConfig extends {
  service: ChimericQuery<any, infer TResult, infer TError, any>;
}
  ? UseQueryResult<TResult, TError>['data'] | undefined
  : TConfig extends {
      service: ChimericEagerAsync<any, infer TResult, any>;
    }
  ? TResult | undefined
  : TConfig extends {
      service: ChimericSync<any, infer TResult>;
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
    | ChimericSync<any, any>
    | ChimericEagerAsync<any, any>
    | ChimericQuery<any, any>;
  getParams?: (params: any) => any;
  getIdiomaticOptions?: (params: any) => any;
  getReactiveOptions?: (params: any) => any;
};

type NoParamsSyncServiceConfig = { service: ChimericSync<void, any> };
type WithParamsSyncServiceConfig = {
  service: ChimericSync<any, any>;
  getParams: (params: any) => any;
};

type NoParamsEagerAsyncServiceConfig = {
  service: ChimericEagerAsync<void, any, any>;
};
type WithParamsEagerAsyncServiceConfig = {
  service: ChimericEagerAsync<any, any, any>;
  getParams: (params: any) => any;
};

type NoParamsQueryServiceConfig = {
  service: ChimericQuery<void, any, any, any>;
};
type WithParamsQueryServiceConfig = {
  service: ChimericQuery<any, any, any, any>;
  getParams: (params: any) => any;
};

type InferService<TConfig, TServiceParams> =
  TConfig extends NoParamsQueryServiceConfig
    ? TConfig['service'] extends ChimericQuery<
        void,
        infer TResult,
        infer TError,
        infer TQueryKey
      >
      ? {
          service: ChimericQuery<void, TResult, TError, TQueryKey>;
          getParams?: never;
          getIdiomaticOptions?: () => {
            options?: IdiomaticQueryOptions;
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          };
          getReactiveOptions?: () => {
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
    ? TConfig['service'] extends ChimericQuery<
        infer TParams,
        infer TResult,
        infer TError,
        infer TQueryKey
      >
      ? {
          service: ChimericQuery<TParams, TResult, TError, TQueryKey>;
          getParams: (params: TServiceParams) => TParams;
          getIdiomaticOptions?: (params: TServiceParams) => {
            options?: IdiomaticQueryOptions;
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          };
          getReactiveOptions?: (params: TServiceParams) => {
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
    ? TConfig['service'] extends ChimericEagerAsync<
        void,
        infer TResult,
        infer TError
      >
      ? {
          service: ChimericEagerAsync<void, TResult, TError>;
          getParams?: never;
          getOptions?: never;
        }
      : never
    : TConfig extends WithParamsEagerAsyncServiceConfig
    ? TConfig['service'] extends ChimericEagerAsync<
        infer TParams,
        infer TResult,
        infer TError
      >
      ? {
          service: ChimericEagerAsync<TParams, TResult, TError>;
          getParams: (params: TServiceParams) => TParams;
          getOptions?: never;
        }
      : never
    : TConfig extends NoParamsSyncServiceConfig
    ? TConfig['service'] extends ChimericSync<void, infer TResult>
      ? {
          service: ChimericSync<void, TResult>;
          getParams?: never;
          getOptions?: never;
        }
      : never
    : TConfig extends WithParamsSyncServiceConfig
    ? TConfig['service'] extends ChimericSync<infer TParams, infer TResult>
      ? {
          service: ChimericSync<TParams, TResult>;
          getParams: (params: TServiceParams) => TParams;
          getOptions?: never;
        }
      : never
    : never;

export const ChimericAsyncReducer = <TServiceParams = void>() => ({
  build: <
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
    TServiceResult,
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
  }): ChimericEagerAsync<TServiceParams, TServiceResult> => {
    const idiomatic = IdiomaticAsyncReducer<TServiceParams>().build({
      serviceList: serviceList.map((service) => {
        return {
          service: (service as AnyServiceConfig).service,
          getParams: (service as AnyServiceConfig).getParams,
          getOptions: (service as AnyServiceConfig).getIdiomaticOptions,
        };
      }) as any,
      reducer: reducer as any,
    });

    const reactive = ReactiveAsyncReducer<TServiceParams>().build({
      serviceList: serviceList.map((service) => {
        return {
          service: (service as AnyServiceConfig).service,
          getParams: (service as AnyServiceConfig).getParams,
          getOptions: (service as AnyServiceConfig).getReactiveOptions,
        };
      }) as any,
      reducer: reducer as any,
      initialValueReducer: initialValueReducer as any,
    });

    return fuseChimericEagerAsync<TServiceParams, TServiceResult>({
      idiomatic: idiomatic as IdiomaticEagerAsync<
        TServiceParams,
        TServiceResult
      >,
      reactive: reactive as ReactiveEagerAsync<TServiceParams, TServiceResult>,
    });
  },
});

export const getService = (service: AnyServiceConfig | undefined) => {
  if (!service) {
    return () => undefined;
  } else {
    return service.service.use || (() => undefined);
  }
};
