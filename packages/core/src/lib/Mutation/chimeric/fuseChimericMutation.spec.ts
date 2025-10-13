/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationTestFixtures } from '../__tests__/mutationFixtures';
import { fuseChimericMutation } from './fuseChimericMutation';

describe('fuseChimericMutation', () => {
  // USAGE TESTS
  it('USAGE: no params', async () => {
    const {
      idiomaticMutation,
      idiomaticFn,
      reactiveMutation,
      reactiveFn,
      invokeFn,
    } = MutationTestFixtures.withoutParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    // Test idiomatic interface - call without options
    await expect(chimericMutation()).resolves.toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with options
    await expect(
      chimericMutation({
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericMutation.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericMutation.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive invoke - without options
    await expect(resultWithOptions.invoke()).resolves.toBe('test');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(1);

    // Test reactive invoke - with options
    await expect(
      reactiveResultWithoutOptions.invoke({
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
    const {
      idiomaticMutation,
      idiomaticFn,
      reactiveMutation,
      reactiveFn,
      invokeFn,
    } = MutationTestFixtures.withParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    // Test idiomatic interface - call without options
    await expect(chimericMutation({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with options
    await expect(
      chimericMutation(
        { name: 'John' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericMutation.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericMutation.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive invoke - without options
    await expect(resultWithOptions.invoke({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);

    // Test reactive invoke - with options
    await expect(
      reactiveResultWithoutOptions.invoke(
        { name: 'John' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(invokeFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: optional params', async () => {
    const {
      idiomaticMutation,
      idiomaticFn,
      reactiveMutation,
      reactiveFn,
      invokeFn,
    } = MutationTestFixtures.withOptionalParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    // Test idiomatic interface - call with params without options
    await expect(chimericMutation({ name: 'John' })).resolves.toBe(
      'Hello John',
    );
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with params with options
    await expect(
      chimericMutation(
        { name: 'John' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test idiomatic interface - call without params without options
    await expect(chimericMutation()).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(3);

    // Test idiomatic interface - call without params with options
    await expect(
      chimericMutation(undefined, {
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(4);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericMutation.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericMutation.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive invoke - with params without options
    await expect(
      resultWithOptions.invoke({ name: 'John' }),
    ).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith({ name: 'John' });
    expect(invokeFn).toHaveBeenCalledTimes(1);

    // Test reactive invoke - with params with options
    await expect(
      reactiveResultWithoutOptions.invoke(
        { name: 'John' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toBe('Hello John');
    expect(invokeFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(invokeFn).toHaveBeenCalledTimes(2);

    // Test reactive invoke - without params without options
    await expect(resultWithOptions.invoke()).resolves.toBe('Hello');
    expect(invokeFn).toHaveBeenCalledWith();
    expect(invokeFn).toHaveBeenCalledTimes(3);

    // Test reactive invoke - without params with options
    await expect(
      reactiveResultWithoutOptions.invoke(undefined, {
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toBe('Hello');
    expect(invokeFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(invokeFn).toHaveBeenCalledTimes(4);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withoutParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericMutation({ name: 'John' });

      const result = chimericMutation.use();
      // @ts-expect-error testing invalid call
      await result.invoke({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericMutation();

      const result = chimericMutation.use();
      // @ts-expect-error testing invalid call
      await result.invoke();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericMutation(1);

      const result = chimericMutation.use();
      // @ts-expect-error testing invalid call
      await result.invoke(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticMutation, reactiveMutation, annotation: _annotation } =
      MutationTestFixtures.withoutParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericMutation;
    expect(testAnnotation).toBe(chimericMutation);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticMutation, reactiveMutation, annotation: _annotation } =
      MutationTestFixtures.withParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericMutation;
    expect(testAnnotation).toBe(chimericMutation);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticMutation, reactiveMutation, annotation: _annotation } =
      MutationTestFixtures.withOptionalParams.getChimeric();
    const chimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericMutation;
    expect(testAnnotation).toBe(chimericMutation);
  });
});
