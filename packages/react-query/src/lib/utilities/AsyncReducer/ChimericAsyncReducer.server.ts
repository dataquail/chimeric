import {
  ChimericEagerAsync,
  fuseChimericEagerAsync,
  createReactiveEagerAsync,
  IdiomaticEagerAsync,
  ReactiveEagerAsync,
  ChimericSync,
  IdiomaticQueryOptions,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { QueryKey, UseQueryResult } from '@tanstack/react-query';
import { IdiomaticAsyncReducer } from './IdiomaticAsyncReducer';
import { throwHookServerError } from '../../serverErrors';
import { TanstackQueryIdiomaticNativeOptions } from '../../Query/idiomatic/types';
import { ChimericQuery } from '../../Query/chimeric/types';
import { TanstackQueryReactiveNativeOptions } from '../../Query/reactive/types';

// Same helper types as the client version
type AnyServiceConfig = {
  service:
    | ChimericSync<unknown, unknown>
    | ChimericEagerAsync<unknown, unknown>
    | ChimericQuery<unknown, unknown>;
  getParams?: (params: unknown) => unknown;
  getIdiomaticOptions?: (params: unknown) => unknown;
  getReactiveOptions?: (params: unknown) => unknown;
};

type AllIdiomaticQueryOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = {
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
};

type AllReactiveQueryOptions<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = {
  options?: ReactiveQueryOptions;
  nativeOptions?: TanstackQueryReactiveNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
};

// Minimal ExtractResults type for the reducer signature
type ExtractServiceResult<TConfig> = TConfig extends {
  service: ChimericQuery<
    infer _TParams,
    infer TResult,
    infer TError,
    infer _TQueryKey
  >;
}
  ? UseQueryResult<TResult, TError>['data']
  : TConfig extends {
      service: ChimericEagerAsync<infer _TParams, infer TResult, infer _TError>;
    }
  ? TResult
  : TConfig extends {
      service: ChimericSync<infer _TParams, infer TResult>;
    }
  ? TResult
  : never;

type ExtractResults<T extends readonly unknown[]> = {
  [K in keyof T]: ExtractServiceResult<T[K]>;
};

type InferService<TConfig, TServiceParams> =
  TConfig extends {
    service: ChimericQuery<
      infer TParams,
      infer TResult,
      infer TError,
      infer TQueryKey
    >;
  }
    ? {
        service: ChimericQuery<TParams, TResult, TError, TQueryKey>;
        getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
        getIdiomaticOptions?: (
          params: TServiceParams,
        ) => AllIdiomaticQueryOptions<TResult, TError, TQueryKey>;
        getReactiveOptions?: (
          params: TServiceParams,
        ) => AllReactiveQueryOptions<TResult, TError, TQueryKey>;
      }
    : TConfig extends {
        service: ChimericEagerAsync<infer TParams, infer TResult, infer TError>;
      }
    ? {
        service: ChimericEagerAsync<TParams, TResult, TError>;
        getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
      }
    : TConfig extends {
        service: ChimericSync<infer TParams, infer TResult>;
      }
    ? {
        service: ChimericSync<TParams, TResult>;
        getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
      }
    : never;

 
export const ChimericAsyncReducer = <TServiceParams = void>() => ({
  build: <
    TServiceResult,
    TConfigList extends readonly InferService<TConfigList[number], TServiceParams>[],
  >({
    reducer,
    serviceList,
  }: {
    serviceList: TConfigList;
    reducer: (
      args: ExtractResults<TConfigList>,
      serviceParams: TServiceParams,
    ) => TServiceResult;
    initialValueReducer?: (
      args: unknown[],
      serviceParams: TServiceParams,
    ) => TServiceResult;
  }): ChimericEagerAsync<TServiceParams, TServiceResult> => {
    const idiomatic = IdiomaticAsyncReducer<TServiceParams>().build({
      serviceList: serviceList.map((service) => ({
        service: (service as AnyServiceConfig).service,
        getParams: (service as AnyServiceConfig).getParams,
        getOptions: (service as AnyServiceConfig).getIdiomaticOptions,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reducer: reducer as any,
    });

    const stubUseHook = () => throwHookServerError('useHook');
    const reactive = createReactiveEagerAsync(stubUseHook);

    return fuseChimericEagerAsync({
      idiomatic: idiomatic as IdiomaticEagerAsync<
        TServiceParams,
        TServiceResult
      >,
      reactive: reactive as unknown as ReactiveEagerAsync<
        TServiceParams,
        TServiceResult
      >,
    });
  },
});

export const getService = (service: AnyServiceConfig | undefined) => {
  if (!service) {
    return () => undefined;
  } else {
    return service.service.useHook || (() => undefined);
  }
};
