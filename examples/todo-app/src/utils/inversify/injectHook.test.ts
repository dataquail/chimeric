import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { renderHook } from '@testing-library/react';
import { injectHook, injectHookWithArguments } from './injectHook';

describe('injectHook', () => {
  type OwnProps = {
    ownProp: string;
  };

  type InjectedProps = {
    injectedProp1: IInjectedProp1;
    injectedProp2: IInjectedProp2;
  };

  type HookWithOwnPropsResult = {
    ownProp: string;
    injectedProp1: string;
    injectedProp2: number;
  };

  const TYPES = {
    InjectedProp1: Symbol.for('InjectedProp1'),
    InjectedProp2: Symbol.for('InjectedProp2'),
  };

  const _hookWithOwnProps = (
    props: OwnProps & InjectedProps,
  ): HookWithOwnPropsResult => {
    return {
      ownProp: props.ownProp,
      injectedProp1: props.injectedProp1.prop,
      injectedProp2: props.injectedProp2.prop,
    };
  };

  type HookWithoutOwnPropsResult = {
    injectedProp1: string;
    injectedProp2: number;
  };

  const _hookWithoutOwnProps = (
    props: InjectedProps,
  ): HookWithoutOwnPropsResult => {
    return {
      injectedProp1: props.injectedProp1.prop,
      injectedProp2: props.injectedProp2.prop,
    };
  };

  interface IInjectedProp1 {
    prop: string;
  }

  interface IInjectedProp2 {
    prop: number;
  }

  @injectable()
  class InjectedProp1Impl implements IInjectedProp1 {
    public prop: string;

    constructor() {
      this.prop = 'prop1';
    }
  }

  @injectable()
  class InjectedProp2Impl implements IInjectedProp2 {
    public prop: number;

    constructor() {
      this.prop = 123;
    }
  }

  it('should inject dependencies', () => {
    const testContainer = new Container();

    testContainer
      .bind<IInjectedProp1>(TYPES.InjectedProp1)
      .to(InjectedProp1Impl);
    testContainer
      .bind<IInjectedProp2>(TYPES.InjectedProp2)
      .to(InjectedProp2Impl);

    const hookWithOwnProps = injectHookWithArguments<
      InjectedProps,
      OwnProps,
      HookWithOwnPropsResult
    >(_hookWithOwnProps, testContainer, {
      injectedProp1: TYPES.InjectedProp1,
      injectedProp2: TYPES.InjectedProp2,
    });

    const { result } = renderHook(() =>
      hookWithOwnProps({ ownProp: 'myOwnProp' }),
    );
    expect(result.current.ownProp).toBe('myOwnProp');
    expect(result.current.injectedProp1).toBe('prop1');
    expect(result.current.injectedProp2).toBe(123);
  });

  it('should inject dependencies with no own props', () => {
    const testContainer = new Container();

    testContainer
      .bind<IInjectedProp1>(TYPES.InjectedProp1)
      .to(InjectedProp1Impl);
    testContainer
      .bind<IInjectedProp2>(TYPES.InjectedProp2)
      .to(InjectedProp2Impl);

    const hookWithoutOwnProps = injectHook(
      _hookWithoutOwnProps,
      testContainer,
      {
        injectedProp1: TYPES.InjectedProp1,
        injectedProp2: TYPES.InjectedProp2,
      },
    );

    const { result } = renderHook(() => hookWithoutOwnProps());
    expect(result.current.injectedProp1).toBe('prop1');
  });

  it('should accept dependency overrides', () => {
    const testContainer = new Container();

    testContainer
      .bind<IInjectedProp1>(TYPES.InjectedProp1)
      .to(InjectedProp1Impl);
    testContainer
      .bind<IInjectedProp2>(TYPES.InjectedProp2)
      .to(InjectedProp2Impl);

    const hookWithOwnProps = injectHookWithArguments<
      InjectedProps,
      OwnProps,
      HookWithOwnPropsResult
    >(_hookWithOwnProps, testContainer, {
      injectedProp1: TYPES.InjectedProp1,
      injectedProp2: TYPES.InjectedProp2,
    });

    const { result } = renderHook(() =>
      hookWithOwnProps({
        ownProp: 'myOwnProp',
        injectedProp1: { prop: 'prop override' },
      }),
    );
    expect(result.current.injectedProp1).toBe('prop override');
  });
});
