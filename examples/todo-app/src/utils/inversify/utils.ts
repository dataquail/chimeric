import { Container } from 'inversify';
import React, { FunctionComponent } from 'react';

export const propsInjector = <Props>(
  container: Container,
  clientPassedProps: Props,
  propMapToInject: {
    [key: string]: symbol;
  },
) => {
  return new Proxy(Object.assign({}, clientPassedProps), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: (target: object, p: string, receiver: any): any => {
      if (p in target) {
        return Reflect.get(target, p, receiver);
      } else if (
        typeof propMapToInject[p] === 'symbol' &&
        container.isBound(propMapToInject[p])
      ) {
        return container.get(propMapToInject[p]);
      } else {
        return Reflect.get(target, p, receiver);
      }
    },
  });
};

export function genericMemo<P>(
  Component: React.FunctionComponent<P>,
  propsAreEqual?: Parameters<typeof React.memo>[1],
) {
  return React.memo(
    Component,
    propsAreEqual,
  ) as unknown as React.FunctionComponent<P extends never ? object : P>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MemoizedComponent = React.MemoExoticComponent<FunctionComponent<any>> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compare?: (prevProps: any, nextProps: any) => boolean;
};

export function getIsMemoizedComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FunctionComponent<any>,
): component is MemoizedComponent {
  return (component as MemoizedComponent).type !== undefined;
}
