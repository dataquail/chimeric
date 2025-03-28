import { appContainer } from 'src/core/global/appContainer';
import { InjectHook, InjectHookWithArguments } from './index';

export const injectHook = <Injected, Result = object>(
  propMap: { [K in keyof Injected]: symbol },
  hook: (args: Injected) => Result,
) => InjectHook<Injected, Result>(appContainer, propMap, hook);

export const injectHookWithArguments = <Injected, Own, Result = object>(
  propMap: { [K in keyof Injected]: symbol },
  hook: (args: Injected & Own) => Result,
) =>
  InjectHookWithArguments<Injected, Own, Result>(appContainer, propMap, hook);
