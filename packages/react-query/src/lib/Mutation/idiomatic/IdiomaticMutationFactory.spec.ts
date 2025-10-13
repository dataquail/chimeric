import { QueryClient } from '@tanstack/react-query';
import { IdiomaticMutationFactory } from './IdiomaticMutationFactory';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';

describe('IdiomaticMutationFactory', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticMutation = IdiomaticMutationFactory({
      queryClient,
      mutationFn,
    });
    const onSuccessSpy = vi.fn();
    const result = await idiomaticMutation({
      nativeOptions: { onSuccess: onSuccessSpy },
    });

    expect(result).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
    expect(onSuccessSpy).toHaveBeenCalledWith('test', undefined, undefined);
  });

  it('USAGE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticMutation = IdiomaticMutationFactory({
      queryClient,
      mutationFn,
    });
    const onSuccessSpy = vi.fn();
    const result = await idiomaticMutation(
      { name: 'John' },
      { nativeOptions: { onSuccess: onSuccessSpy } },
    );

    expect(result).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' });
    expect(onSuccessSpy).toHaveBeenCalledWith(
      'Hello John',
      { name: 'John' },
      undefined,
    );
  });

  it('USAGE: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticMutation = IdiomaticMutationFactory({
      queryClient,
      mutationFn,
    });
    const onSuccessSpy = vi.fn();
    const result1 = await idiomaticMutation(undefined, {
      nativeOptions: { onSuccess: onSuccessSpy },
    });

    expect(result1).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined);
    expect(onSuccessSpy).toHaveBeenCalledWith('Hello', undefined, undefined);
    const result2 = await idiomaticMutation(
      { name: 'Jane' },
      {
        nativeOptions: { onSuccess: onSuccessSpy },
      },
    );

    expect(result2).toBe('Hello Jane');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Jane' });
    expect(onSuccessSpy).toHaveBeenCalledWith(
      'Hello Jane',
      { name: 'Jane' },
      undefined,
    );
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticMutation = IdiomaticMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticMutation({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticMutation = IdiomaticMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticMutation();

      // @ts-expect-error - Testing type error
      await idiomaticMutation({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const { mutationFn } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();
    const queryClient = new QueryClient();
    const idiomaticMutation = IdiomaticMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await idiomaticMutation({ wrong: 'param' });

      await idiomaticMutation();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withoutParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = IdiomaticMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
