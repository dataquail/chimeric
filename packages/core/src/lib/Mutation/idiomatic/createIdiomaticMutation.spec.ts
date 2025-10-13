/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticMutation } from './createIdiomaticMutation';
import { MutationTestFixtures } from '../__tests__/mutationFixtures';

describe('createIdiomaticMutation', () => {
  it('should create an idiomatic mutation function', () => {
    const { fn } = MutationTestFixtures.withoutParams.getIdiomatic();
    const idiomaticMutation = createIdiomaticMutation(fn);
    expect(typeof idiomaticMutation).toBe('function');
    expect(idiomaticMutation).toBe(fn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticMutation(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic mutation');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic();
    // Usage implementation test
    const resultWithoutOptions = await idiomaticMutation();
    expect(idiomaticMutation).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toBe('test');
    const resultWithOptions = await idiomaticMutation({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticMutation).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toBe('test');
  });

  it('USAGE: with params', async () => {
    const { fn, idiomaticMutation } =
      MutationTestFixtures.withParams.getIdiomatic();
    // Usage implementation test
    const resultWithoutOptions = await idiomaticMutation({ name: 'John' });
    expect(idiomaticMutation).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toBe('Hello John');
    const resultWithOptions = await idiomaticMutation(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(idiomaticMutation).toHaveBeenCalledWith(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toBe('Hello John');
  });

  it('USAGE: optional params', async () => {
    const { fn, idiomaticMutation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();
    // Usage implementation test
    const resultWithParamsWithoutOptions = await idiomaticMutation({
      name: 'John',
    });
    expect(idiomaticMutation).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParamsWithoutOptions).toBe('Hello John');
    const resultWithParamsWithOptions = await idiomaticMutation(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(idiomaticMutation).toHaveBeenCalledWith(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithParamsWithOptions).toBe('Hello John');
    const resultWithoutParamsWithoutOptions = await idiomaticMutation();
    expect(idiomaticMutation).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);
    expect(resultWithoutParamsWithoutOptions).toBe('Hello');
    const resultWithoutParamsWithOptions = await idiomaticMutation(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticMutation).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(4);
    expect(resultWithoutParamsWithOptions).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticMutation({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticMutation();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticMutation(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticMutation, annotation: _annotation } =
      MutationTestFixtures.withoutParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticMutation;
    expect(testAnnotation).toBe(idiomaticMutation);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticMutation, annotation: _annotation } =
      MutationTestFixtures.withParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticMutation;
    expect(testAnnotation).toBe(idiomaticMutation);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticMutation, annotation: _annotation } =
      MutationTestFixtures.withOptionalParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticMutation;
    expect(testAnnotation).toBe(idiomaticMutation);
  });
});
