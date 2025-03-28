import { Container } from 'inversify';
import { propsInjector } from '../utils';

// TypeScript doesn't infer generics when default types are passed in. - https://github.com/microsoft/TypeScript/issues/14400
// As a workaround, we provide two injection functions with an almost identical signature.
// 1. injectHookWithArguments: Should be used when a hook requires parameters in addition to the injected dependencies.
// 2. injectHook: Should be used when a hook does not require parameters.

export function InjectHook<Injected, Result = object>(
  container: Container,
  propMap: { [K in keyof Injected]: symbol },
  hook: (args: Injected) => Result,
): (props?: Partial<Injected>) => Result {
  return (clientPassedProps?: Partial<Injected>) => {
    const injectedProps = propsInjector(
      container,
      clientPassedProps,
      propMap,
    ) as Injected;
    return hook(injectedProps);
  };
}

export function InjectHookWithArguments<Injected, Own, Result = object>(
  container: Container,
  propMap: { [K in keyof Injected]: symbol },
  hook: (args: Injected & Own) => Result,
): (props: Own & Partial<Injected>) => Result {
  return ((clientPassedProps?: Injected) => {
    const injectedProps = propsInjector(
      container,
      clientPassedProps,
      propMap,
    ) as Injected & Own;
    return hook(injectedProps);
  }) as (props: Own & Partial<Injected>) => Result;
}
