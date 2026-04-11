import { QueryClient } from '@tanstack/vue-query';
import { ChimericMutationFactory } from './ChimericMutationFactory';
import { withQuerySetup, flushPromises } from '../../__tests__/getTestWrapper';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';

describe('ChimericMutationFactory', () => {
  const expectedContext = expect.objectContaining({
    client: expect.any(QueryClient),
  });
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { result } = withQuerySetup(() => chimericMutation.useHook(), queryClient);

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    await result.invoke();
    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { result } = withQuerySetup(() => chimericMutation.useHook(), queryClient);

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    await result.invoke({ name: 'John' });
    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' }, expectedContext);
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { mutationFn } = MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { result } = withQuerySetup(() => chimericMutation.useHook(), queryClient);

    expect(result.isIdle.value).toBe(true);
    expect(result.isSuccess.value).toBe(false);

    await result.invoke();
    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined, expectedContext);

    await result.invoke({ name: 'Jane' });
    await flushPromises();

    expect(result.isSuccess.value).toBe(true);
    expect(result.data.value).toBe('Hello Jane');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Jane' }, expectedContext);
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const result = await chimericMutation();

    expect(result).toBe('test');
    expect(mutationFn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const result = await chimericMutation({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { mutationFn } = MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const result1 = await chimericMutation();
    expect(result1).toBe('Hello');
    expect(mutationFn).toHaveBeenCalledWith(undefined);

    const result2 = await chimericMutation({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { result } = withQuerySetup(() => chimericMutation.useHook(), queryClient);

    try {
      // @ts-expect-error - Testing type error
      await result.invoke({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { result } = withQuerySetup(() => chimericMutation.useHook(), queryClient);

    try {
      // @ts-expect-error - Testing type error
      await result.invoke();

      // @ts-expect-error - Testing type error
      await result.invoke({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const { mutationFn } = MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    const { result } = withQuerySetup(() => chimericMutation.useHook(), queryClient);

    try {
      // @ts-expect-error - Testing type error
      await result.invoke({ wrong: 'param' });

      await result.invoke();
    } catch {
      // Expected error
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { mutationFn } = MutationTestFixtures.withoutParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { mutationFn } = MutationTestFixtures.withParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation();

      // @ts-expect-error - Testing type error
      await chimericMutation({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { mutationFn } = MutationTestFixtures.withOptionalParams.getChimeric();
    const queryClient = new QueryClient();
    const chimericMutation = ChimericMutationFactory({
      queryClient,
      mutationFn,
    });

    try {
      // @ts-expect-error - Testing type error
      await chimericMutation({ wrong: 'param' });

      await chimericMutation();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, mutationFn } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericMutationFactory({
      queryClient: new QueryClient(),
      mutationFn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
