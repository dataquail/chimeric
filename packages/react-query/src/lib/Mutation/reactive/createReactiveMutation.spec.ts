/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationTestFixtures } from '../__tests__/mutationFixtures';
import { createReactiveMutation } from './createReactiveMutation';

describe('createReactiveMutation', () => {
  it('should create a reactive mutation function', () => {
    const { fn } = MutationTestFixtures.withoutParams.getReactive();
    const reactiveMutation = createReactiveMutation(fn);

    expect(typeof reactiveMutation).toBe('object');
    expect(reactiveMutation).toHaveProperty('use');
    expect(typeof reactiveMutation.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveMutation(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive mutation');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, invokeFn, reactiveMutation } =
      MutationTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveMutation.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    const allOptions = {
      options: undefined,
      nativeOptions: { onSuccess: () => 'success' },
    };
    const resultWithOptions = reactiveMutation.use(allOptions);
    expect(fn).toHaveBeenCalledWith(allOptions);
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - invoke() calls
    await expect(resultWithoutOptions.invoke()).resolves.toBe('test');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.invoke({
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toBe('test');
    expect(invokeFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(invokeFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with params', async () => {
    const { fn, invokeFn, reactiveMutation } =
      MutationTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveMutation.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    const allOptions = {
      options: undefined,
      nativeOptions: { onSuccess: () => 'success' },
    };
    const resultWithOptions = reactiveMutation.use(allOptions);
    expect(fn).toHaveBeenCalledWith(allOptions);
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - invoke() calls
    await expect(resultWithoutOptions.invoke({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.invoke({ name: 'John' }, allOptions),
    ).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' }, allOptions);
    expect(invokeFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: optional params', async () => {
    const { fn, invokeFn, reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveMutation.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    const allOptions = {
      options: undefined,
      nativeOptions: { onSuccess: () => 'success' },
    };
    const resultWithOptions = reactiveMutation.use(allOptions);
    expect(fn).toHaveBeenCalledWith(allOptions);
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - invoke() with params
    await expect(resultWithoutOptions.invoke({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.invoke({ name: 'John' }, allOptions),
    ).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' }, allOptions);
    expect(invokeFn).toHaveBeenCalledTimes(2);

    // Usage implementation test - invoke() without params
    await expect(resultWithoutOptions.invoke()).resolves.toBe('Hello');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(3);

    await expect(resultWithOptions.invoke(undefined, allOptions)).resolves.toBe(
      'Hello',
    );
    expect(invokeFn).toHaveBeenCalledWith(undefined, allOptions);
    expect(invokeFn).toHaveBeenCalledTimes(4);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { reactiveMutation } =
      MutationTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveMutation.use({ fake: 'option' });
    } catch {
      // Expected to throw
    }

    const result = reactiveMutation.use();
    try {
      // @ts-expect-error testing invalid call
      await result.invoke({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { reactiveMutation } = MutationTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveMutation.use({ fake: 'option' });
    } catch {
      // Expected to throw
    }

    const result = reactiveMutation.use();
    try {
      // @ts-expect-error testing invalid call
      await result.invoke();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveMutation.use({ fake: 'option' });
    } catch {
      // Expected to throw
    }

    const result = reactiveMutation.use();
    try {
      // @ts-expect-error testing invalid call
      await result.invoke(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { reactiveMutation, annotation: _annotation } =
      MutationTestFixtures.withoutParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveMutation;
    expect(testAnnotation).toBe(reactiveMutation);
  });

  it('ANNOTATION: with params', async () => {
    const { reactiveMutation, annotation: _annotation } =
      MutationTestFixtures.withParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveMutation;
    expect(testAnnotation).toBe(reactiveMutation);
  });

  it('ANNOTATION: optional params', async () => {
    const { reactiveMutation, annotation: _annotation } =
      MutationTestFixtures.withOptionalParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveMutation;
    expect(testAnnotation).toBe(reactiveMutation);
  });
});
