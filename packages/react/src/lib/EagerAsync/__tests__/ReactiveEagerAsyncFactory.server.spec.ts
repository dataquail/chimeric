import { ReactiveEagerAsyncFactory } from '../ReactiveEagerAsyncFactory.server';
import { EagerAsyncTestFixtures } from '../../__tests__/eagerAsyncFixtures';

describe('ReactiveEagerAsyncFactoryServer', () => {
  it('throws when constructing with no params', () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getReactive();

    expect(() =>
      ReactiveEagerAsyncFactory({ eagerAsyncFn: fn }),
    ).toThrow(
      "@chimeric/react: ReactiveEagerAsyncFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with params', () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getReactive();

    expect(() =>
      ReactiveEagerAsyncFactory({ eagerAsyncFn: fn }),
    ).toThrow(
      "@chimeric/react: ReactiveEagerAsyncFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with optional params', () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getReactive();

    expect(() =>
      ReactiveEagerAsyncFactory({ eagerAsyncFn: fn }),
    ).toThrow(
      "@chimeric/react: ReactiveEagerAsyncFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });
});
