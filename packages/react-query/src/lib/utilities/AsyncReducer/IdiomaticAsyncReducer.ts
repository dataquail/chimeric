/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIdiomaticEagerAsync,
  IdiomaticEagerAsync,
  IdiomaticQueryOptions,
  IdiomaticSync,
  isIdiomaticEagerAsync,
  isIdiomaticQuery,
  isIdiomaticSync,
} from '@chimeric/core';
import {
  IdiomaticQuery,
  TanstackQueryIdiomaticNativeOptions,
} from 'src/lib/Query/idiomatic/types';

// Helper type to extract the result type from a service configuration
type ExtractServiceResult<TConfig> = TConfig extends {
  service: IdiomaticQuery<infer _TParams, infer TResult>;
}
  ? TResult
  : TConfig extends {
      service: IdiomaticEagerAsync<infer _TParams, infer TResult>;
    }
  ? TResult
  : TConfig extends {
      service: IdiomaticSync<infer _TParams, infer TResult>;
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

type AnyServiceConfig = {
  service:
    | IdiomaticSync<any, any>
    | IdiomaticEagerAsync<any, any>
    | IdiomaticQuery<any, any>;
  getParams?: (params: any) => any;
};

type NoParamsEagerAsyncServiceConfig = {
  service: IdiomaticEagerAsync<void, any>;
};
type WithParamsEagerAsyncServiceConfig = {
  service: IdiomaticEagerAsync<any, any>;
  getParams: (params: any) => any;
};

type NoParamsQueryServiceConfig = {
  service: IdiomaticQuery<void, any, any, any>;
};
type WithParamsQueryServiceConfig = {
  service: IdiomaticQuery<any, any, any, any>;
  getParams: (params: any) => any;
};

type InferIdiomaticSync<T extends (args: Parameters<T>[0]) => ReturnType<T>> =
  T;

type InferService<TConfig, TServiceParams> =
  TConfig extends NoParamsQueryServiceConfig
    ? TConfig['service'] extends IdiomaticQuery<
        void,
        infer TResult,
        infer TError,
        infer TQueryKey
      >
      ? {
          service: IdiomaticQuery<void, TResult, TError, TQueryKey>;
          getParams?: never;
          getOptions?: () => {
            options?: IdiomaticQueryOptions;
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          };
        }
      : never
    : TConfig extends WithParamsQueryServiceConfig
    ? TConfig['service'] extends IdiomaticQuery<
        infer TParams,
        infer TResult,
        infer TError,
        infer TQueryKey
      >
      ? {
          service: IdiomaticQuery<TParams, TResult, TError, TQueryKey>;
          getParams: (params: TServiceParams) => TParams;
          getOptions?: () => {
            options?: IdiomaticQueryOptions;
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          };
        }
      : never
    : TConfig extends NoParamsEagerAsyncServiceConfig
    ? TConfig['service'] extends IdiomaticEagerAsync<void, infer TResult>
      ? {
          service: IdiomaticEagerAsync<void, TResult>;
          getParams?: never;
          getOptions?: never;
        }
      : never
    : TConfig extends WithParamsEagerAsyncServiceConfig
    ? TConfig['service'] extends IdiomaticEagerAsync<
        infer TParams,
        infer TResult
      >
      ? {
          service: IdiomaticEagerAsync<TParams, TResult>;
          getParams: (params: TServiceParams) => TParams;
          getOptions?: never;
        }
      : never
    : TConfig extends {
        service: InferIdiomaticSync<infer T>;
      }
    ? Parameters<T> extends []
      ? {
          service: IdiomaticSync<void, ReturnType<T>>;
          getParams?: never;
          getOptions?: never;
        }
      : undefined extends Parameters<T>[0]
      ? {
          service: IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
          getParams?:
            | ((params: TServiceParams) => Parameters<T>[0])
            | (() => Parameters<T>[0]);
          getOptions?: never;
        }
      : {
          service: IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
          getParams:
            | ((params: TServiceParams) => Parameters<T>[0])
            | (() => Parameters<T>[0]);
          getOptions?: never;
        }
    : never;

export const IdiomaticAsyncReducer = <TServiceParams = void>() => ({
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
    serviceList,
  }: {
    serviceList: TConfigList;
    reducer: (
      args: ExtractResults<TConfigList>,
      serviceParams: TServiceParams,
    ) => TServiceResult;
  }): IdiomaticEagerAsync<TServiceParams, TServiceResult> => {
    const service0 = getService(serviceList[0]);
    const service1 = getService(serviceList[1]);
    const service2 = getService(serviceList[2]);
    const service3 = getService(serviceList[3]);
    const service4 = getService(serviceList[4]);
    const service5 = getService(serviceList[5]);
    const service6 = getService(serviceList[6]);
    const service7 = getService(serviceList[7]);
    const service8 = getService(serviceList[8]);
    const service9 = getService(serviceList[9]);

    return createIdiomaticEagerAsync<TServiceParams, TServiceResult>(
      async (params) => {
        const results = [
          await service0(getArgs(serviceList[0], params)),
          await service1(getArgs(serviceList[1], params)),
          await service2(getArgs(serviceList[2], params)),
          await service3(getArgs(serviceList[3], params)),
          await service4(getArgs(serviceList[4], params)),
          await service5(getArgs(serviceList[5], params)),
          await service6(getArgs(serviceList[6], params)),
          await service7(getArgs(serviceList[7], params)),
          await service8(getArgs(serviceList[8], params)),
          await service9(getArgs(serviceList[9], params)),
        ].slice(0, serviceList.length) as ExtractResults<TConfigList>;

        return reducer(results, params);
      },
    );
  },
});

const getService = (service: AnyServiceConfig | undefined) => {
  if (!service) {
    return () => undefined;
  } else {
    return service.service || (() => undefined);
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
  const params = (service as { getParams: (params: any) => any })?.getParams
    ? (service as { getParams: (params: any) => any }).getParams(serviceParams)
    : undefined;

  if (isIdiomaticSync(service.service)) {
    return params;
  } else if (isIdiomaticEagerAsync(service.service)) {
    return params;
  } else if (isIdiomaticQuery(service.service)) {
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
