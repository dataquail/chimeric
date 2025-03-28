import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { render, screen } from '@testing-library/react';
import { InjectComponent } from 'src/utils/inversify/InjectComponent';

describe('InjectComponent', () => {
  type OwnProps = {
    ownProp: string;
  };

  type InjectedProps = {
    injectedProp1: IInjectedProp1;
    injectedProp2: IInjectedProp2;
  };

  const TYPES = {
    InjectedProp1: Symbol.for('InjectedProp1'),
    InjectedProp2: Symbol.for('InjectedProp2'),
  };

  const _TestComponentWithOwnProps = (props: OwnProps & InjectedProps) => {
    return (
      <div>
        <div>{props.ownProp}</div>
        <div>{props.injectedProp1.prop}</div>
        <div>{props.injectedProp2.prop}</div>
      </div>
    );
  };

  const _TestComponentWithoutOwnProps = (props: InjectedProps) => {
    return (
      <div>
        <div>{props.injectedProp1.prop}</div>
        <div>{props.injectedProp2.prop}</div>
      </div>
    );
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

    const TestComponent = InjectComponent<InjectedProps, OwnProps>(
      testContainer,
      {
        injectedProp1: TYPES.InjectedProp1,
        injectedProp2: TYPES.InjectedProp2,
      },
      _TestComponentWithOwnProps,
    );

    render(<TestComponent ownProp="ownProp" />);
    expect(screen.getByText('ownProp')).toBeInTheDocument();
    expect(screen.getByText('prop1')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should inject without ownProps dependencies', () => {
    const testContainer = new Container();
    testContainer
      .bind<IInjectedProp1>(TYPES.InjectedProp1)
      .to(InjectedProp1Impl);
    testContainer
      .bind<IInjectedProp2>(TYPES.InjectedProp2)
      .to(InjectedProp2Impl);

    const TestComponent = InjectComponent<InjectedProps>(
      testContainer,
      {
        injectedProp1: TYPES.InjectedProp1,
        injectedProp2: TYPES.InjectedProp2,
      },
      _TestComponentWithoutOwnProps,
    );

    render(<TestComponent />);
    expect(screen.getByText('prop1')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should accept dependency overrides', () => {
    const testContainer = new Container();
    const TYPES = {
      InjectedProp1: Symbol.for('InjectedProp1'),
      InjectedProp2: Symbol.for('InjectedProp2'),
    };

    testContainer
      .bind<IInjectedProp1>(TYPES.InjectedProp1)
      .to(InjectedProp1Impl);
    testContainer
      .bind<IInjectedProp2>(TYPES.InjectedProp2)
      .to(InjectedProp2Impl);

    const TestComponent = InjectComponent<InjectedProps>(
      testContainer,
      {
        injectedProp1: TYPES.InjectedProp1,
        injectedProp2: TYPES.InjectedProp2,
      },
      _TestComponentWithoutOwnProps,
    );

    render(<TestComponent injectedProp1={{ prop: 'prop override' }} />);
    expect(screen.getByText('prop override')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});
