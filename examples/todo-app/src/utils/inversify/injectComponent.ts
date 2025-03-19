import { Container } from 'inversify';
import { getIsMemoizedComponent, genericMemo, propsInjector } from './utils';
import { type PropsWithChildren } from 'react';

export const injectComponent = <
  InjectedProps extends {
    [K in keyof InjectedProps]: K extends keyof OwnProps
      ? never
      : InjectedProps[K];
  },
  OwnProps = object,
  PropMap extends {
    [K in keyof InjectedProps]: symbol;
  } = {
    [K in keyof InjectedProps]: symbol;
  },
>(
  Target: React.FunctionComponent<
    (OwnProps extends never ? object : OwnProps) &
      (InjectedProps extends object ? InjectedProps : never)
  >,
  container: Container,
  propMap: PropMap,
): React.FunctionComponent<
  OwnProps extends never ? object : OwnProps & Partial<InjectedProps>
> => {
  if (container === undefined) {
    throw new Error(
      `injectComponent was called with an undefined container.` +
        `This is typically caused by circular dependencies.` +
        ` Check the implementation of ${Target.name}.`,
    );
  }

  const isMemoizedComponent = getIsMemoizedComponent(Target);
  const componentToInject = isMemoizedComponent ? Target.type : Target;
  const compare = isMemoizedComponent ? Target.compare : undefined;

  const InjectedComponent = genericMemo(
    (clientPassedProps: OwnProps & Partial<InjectedProps>) => {
      const proxiedProps = propsInjector(container, clientPassedProps, propMap);
      return componentToInject(
        proxiedProps as unknown as PropsWithChildren<
          React.ComponentProps<typeof Target>
        >,
      );
    },
    compare,
  );

  return InjectedComponent;
};
