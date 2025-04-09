import { IdiomaticQueryOptions, ReactiveQueryOptions } from '@chimeric/core';

export const getParamsAndOptionsFromReactiveQuery = <TParams>(
  paramsOrOptions: TParams | ReactiveQueryOptions,
  optionsOrNever: ReactiveQueryOptions | void,
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
    options = optionsOrNever;
  }
  return { params, options };
};

export const getParamsAndOptionsFromIdiomaticQuery = <TParams>(
  paramsOrOptions: TParams | IdiomaticQueryOptions,
  optionsOrNever: IdiomaticQueryOptions | void,
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
    options = optionsOrNever;
  }
  return { params, options };
};
