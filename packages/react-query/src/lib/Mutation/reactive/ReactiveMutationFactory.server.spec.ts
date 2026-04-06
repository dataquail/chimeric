import { ReactiveMutationFactory } from './ReactiveMutationFactory.server';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';

describe('ReactiveMutationFactoryServer', () => {
  it('throws when constructing with no params', () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getReactive();

    expect(() =>
      ReactiveMutationFactory({ mutationFn }),
    ).toThrow(
      "@chimeric/react-query: ReactiveMutationFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with params', () => {
    const { mutationFn } = MutationTestFixtures.withParams.getReactive();

    expect(() =>
      ReactiveMutationFactory({ mutationFn }),
    ).toThrow(
      "@chimeric/react-query: ReactiveMutationFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with optional params', () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getReactive();

    expect(() =>
      ReactiveMutationFactory({ mutationFn }),
    ).toThrow(
      "@chimeric/react-query: ReactiveMutationFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });
});
