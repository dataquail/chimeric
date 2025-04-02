import {
  ReactivePromiseOptions,
  ReactivePromiseOptionsOrNever,
  ReactivePromiseParamsOrOptions,
} from '@chimeric/core';

export const getParamsAndOptionsFromReactivePromise = <TParams>(
  paramsOrOptions: ReactivePromiseParamsOrOptions<TParams> | undefined,
  optionsOrNever: ReactivePromiseOptionsOrNever<TParams> | undefined,
) => {
  let params = undefined as TParams;
  let options: ReactivePromiseOptions = {
    invokeOnMount: false,
  };
  if (paramsOrOptions && !optionsOrNever) {
    if (
      paramsOrOptions instanceof Object &&
      'invokeOnMount' in paramsOrOptions &&
      typeof paramsOrOptions.invokeOnMount === 'boolean'
    ) {
      options.invokeOnMount = paramsOrOptions.invokeOnMount;
    } else {
      params = paramsOrOptions as TParams;
    }
  } else if (paramsOrOptions && optionsOrNever) {
    params = paramsOrOptions as TParams;
    options = optionsOrNever as ReactivePromiseOptions;
  }
  return { params, options };
};
