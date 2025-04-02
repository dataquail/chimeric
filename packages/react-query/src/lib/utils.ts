import {
  IdiomaticQueryOptions,
  IdiomaticQueryOptionsOrNever,
  IdiomaticQueryParams,
  ReactiveQueryOptions,
  ReactiveQueryOptionsOrNever,
  ReactiveQueryParamsOrOptions,
} from '@chimeric/core';

export const getParamsAndOptionsFromReactiveQuery = <TParams>(
  paramsOrOptions: ReactiveQueryParamsOrOptions<TParams> | undefined,
  optionsOrNever: ReactiveQueryOptionsOrNever<TParams> | undefined,
) => {
  let params = undefined as TParams;
  let options: ReactiveQueryOptions = {
    enabled: true,
  };
  if (paramsOrOptions && !optionsOrNever) {
    if (
      paramsOrOptions instanceof Object &&
      'enabled' in paramsOrOptions &&
      typeof paramsOrOptions.enabled === 'boolean'
    ) {
      options.enabled = paramsOrOptions.enabled;
    } else {
      params = paramsOrOptions as TParams;
    }
  } else if (paramsOrOptions && optionsOrNever) {
    params = paramsOrOptions as TParams;
    options = optionsOrNever as ReactiveQueryOptions;
  }
  return { params, options };
};

export const getParamsAndOptionsFromIdiomaticQuery = <TParams>(
  paramsOrOptions: IdiomaticQueryParams<TParams> | undefined,
  optionsOrNever: IdiomaticQueryOptionsOrNever<TParams> | undefined,
) => {
  let params = undefined as TParams;
  let options: IdiomaticQueryOptions = {
    forceRefetch: false,
  };
  if (paramsOrOptions && !optionsOrNever) {
    if (
      paramsOrOptions instanceof Object &&
      'forceRefetch' in paramsOrOptions &&
      typeof paramsOrOptions.forceRefetch === 'boolean'
    ) {
      options.forceRefetch = paramsOrOptions.forceRefetch;
    } else {
      params = paramsOrOptions as TParams;
    }
  } else if (paramsOrOptions && optionsOrNever) {
    params = paramsOrOptions as TParams;
    options = optionsOrNever as IdiomaticQueryOptions;
  }
  return { params, options };
};
