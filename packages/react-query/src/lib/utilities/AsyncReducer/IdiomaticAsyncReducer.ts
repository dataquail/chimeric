/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIdiomaticEagerAsync,
  IdiomaticEagerAsync,
  IdiomaticQueryOptions,
  IdiomaticSync,
  isIdiomaticEagerAsync,
  isIdiomaticSync,
} from '@chimeric/core';
import { isIdiomaticQuery } from '../../Query/idiomatic/isIdiomaticQuery';
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

type InferIdiomaticSync<T extends (args: Parameters<T>[0]) => ReturnType<T>> =
  T;

type InferService<TConfig, TServiceParams> =
  // QUERY
  TConfig extends {
    service: IdiomaticQuery<
      infer TParams,
      infer TResult,
      infer TError,
      infer TQueryKey
    >;
  }
    ? [TParams] extends [void]
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
      : void extends TParams
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
      : undefined extends TParams
      ? {
          service: IdiomaticQuery<TParams, TResult, TError, TQueryKey>;
          getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
          getOptions?:
            | ((params: TServiceParams) => {
                options?: IdiomaticQueryOptions;
                nativeOptions?: TanstackQueryIdiomaticNativeOptions<
                  TResult,
                  TError,
                  TQueryKey
                >;
              })
            | (() => {
                options?: IdiomaticQueryOptions;
                nativeOptions?: TanstackQueryIdiomaticNativeOptions<
                  TResult,
                  TError,
                  TQueryKey
                >;
              });
        }
      : {
          service: IdiomaticQuery<TParams, TResult, TError, TQueryKey>;
          getParams: ((params: TServiceParams) => TParams) | (() => TParams);
          getOptions?:
            | ((params: TServiceParams) => {
                options?: IdiomaticQueryOptions;
                nativeOptions?: TanstackQueryIdiomaticNativeOptions<
                  TResult,
                  TError,
                  TQueryKey
                >;
              })
            | (() => {
                options?: IdiomaticQueryOptions;
                nativeOptions?: TanstackQueryIdiomaticNativeOptions<
                  TResult,
                  TError,
                  TQueryKey
                >;
              });
        }
    : // EAGER ASYNC
    TConfig extends {
        service: IdiomaticEagerAsync<infer TParams, infer TResult>;
      }
    ? [TParams] extends [void]
      ? {
          service: IdiomaticEagerAsync<void, TResult>;
          getParams?: never;
          getOptions?: never;
        }
      : void extends TParams
      ? {
          service: IdiomaticEagerAsync<void, TResult>;
          getParams?: never;
          getOptions?: never;
        }
      : undefined extends TParams
      ? {
          service: IdiomaticEagerAsync<TParams, TResult>;
          getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
          getOptions?: never;
        }
      : {
          service: IdiomaticEagerAsync<TParams, TResult>;
          getParams: ((params: TServiceParams) => TParams) | (() => TParams);
          getOptions?: never;
        }
    : // SYNC
    TConfig extends {
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
        const [paramsOrMaybeOptions0, maybeOptions0] = getArgs(
          serviceList[0],
          params,
        );
        const [paramsOrMaybeOptions1, maybeOptions1] = getArgs(
          serviceList[1],
          params,
        );
        const [paramsOrMaybeOptions2, maybeOptions2] = getArgs(
          serviceList[2],
          params,
        );
        const [paramsOrMaybeOptions3, maybeOptions3] = getArgs(
          serviceList[3],
          params,
        );
        const [paramsOrMaybeOptions4, maybeOptions4] = getArgs(
          serviceList[4],
          params,
        );
        const [paramsOrMaybeOptions5, maybeOptions5] = getArgs(
          serviceList[5],
          params,
        );
        const [paramsOrMaybeOptions6, maybeOptions6] = getArgs(
          serviceList[6],
          params,
        );
        const [paramsOrMaybeOptions7, maybeOptions7] = getArgs(
          serviceList[7],
          params,
        );
        const [paramsOrMaybeOptions8, maybeOptions8] = getArgs(
          serviceList[8],
          params,
        );
        const [paramsOrMaybeOptions9, maybeOptions9] = getArgs(
          serviceList[9],
          params,
        );
        const results = [
          await service0(paramsOrMaybeOptions0, maybeOptions0),
          await service1(paramsOrMaybeOptions1, maybeOptions1),
          await service2(paramsOrMaybeOptions2, maybeOptions2),
          await service3(paramsOrMaybeOptions3, maybeOptions3),
          await service4(paramsOrMaybeOptions4, maybeOptions4),
          await service5(paramsOrMaybeOptions5, maybeOptions5),
          await service6(paramsOrMaybeOptions6, maybeOptions6),
          await service7(paramsOrMaybeOptions7, maybeOptions7),
          await service8(paramsOrMaybeOptions8, maybeOptions8),
          await service9(paramsOrMaybeOptions9, maybeOptions9),
        ].slice(0, serviceList.length) as ExtractResults<TConfigList>;

        return reducer(results, params);
      },
    );
  },
});

const getService = (
  service: AnyServiceConfig | undefined,
): ((paramsOrMaybeOptions?: any, maybeOptions?: any) => any) => {
  if (!service) {
    return () => undefined;
  } else {
    return service.service || (() => undefined);
  }
};

const getArgs = <TServiceParams>(
  serviceConfig: AnyServiceConfig | undefined,
  serviceParams: TServiceParams | void,
):
  | []
  | [paramsOrMaybeOptions: any]
  | [paramsOrMaybeOptions: any, maybeOptions: any] => {
  if (!serviceConfig) {
    return [];
  }

  // Get params either from getParams function or undefined for void services
  if (isIdiomaticSync(serviceConfig.service)) {
    const params = serviceConfig?.getParams
      ? serviceConfig.getParams(serviceParams)
      : undefined;
    return [params];
  } else if (isIdiomaticQuery(serviceConfig.service)) {
    const params = serviceConfig?.getParams
      ? serviceConfig.getParams(serviceParams)
      : undefined;
    const options =
      (
        serviceConfig as { getOptions?: (serviceParams: any) => void }
      )?.getOptions?.(params) ?? {};

    return serviceConfig.service.length > 1 ? [params, options] : [options];
  } else if (isIdiomaticEagerAsync(serviceConfig.service)) {
    const params = serviceConfig?.getParams
      ? serviceConfig.getParams(serviceParams)
      : undefined;
    return [params];
  } else {
    throw new Error('Invalid service type');
  }
};
