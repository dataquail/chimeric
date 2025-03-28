import { appContainer } from 'src/core/global/appContainer';
import { InjectComponent } from './index';

/**
 * A version of injectComponent that uses the appContainer by default
 */
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
  propMap: PropMap,
  Target: React.FunctionComponent<
    (OwnProps extends never ? object : OwnProps) &
      (InjectedProps extends object ? InjectedProps : never)
  >,
): React.FunctionComponent<
  OwnProps extends never ? object : OwnProps & Partial<InjectedProps>
> =>
  InjectComponent<InjectedProps, OwnProps, PropMap>(
    appContainer,
    propMap,
    Target,
  );
