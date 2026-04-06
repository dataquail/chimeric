import { ReactiveAsyncFactory } from '../ReactiveAsyncFactory.server';
import { AsyncTestFixtures } from '../../__tests__/asyncFixtures';

describe('ReactiveAsyncFactoryServer', () => {
  it('throws when constructing with no params', () => {
    const { fn } = AsyncTestFixtures.withoutParams.getReactive();

    expect(() => ReactiveAsyncFactory(fn)).toThrow(
      "@chimeric/react: ReactiveAsyncFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with params', () => {
    const { fn } = AsyncTestFixtures.withParams.getReactive();

    expect(() => ReactiveAsyncFactory(fn)).toThrow(
      "@chimeric/react: ReactiveAsyncFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with optional params', () => {
    const { fn } = AsyncTestFixtures.withOptionalParams.getReactive();

    expect(() => ReactiveAsyncFactory(fn)).toThrow(
      "@chimeric/react: ReactiveAsyncFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });
});
