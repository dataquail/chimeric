import { render, waitFor } from '@testing-library/svelte';
import { ChimericEagerAsyncFactory } from './ChimericEagerAsyncFactory';
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import ReactiveEagerAsyncTestWrapper from '../__tests__/ReactiveEagerAsyncTestWrapper.svelte';

describe('ChimericEagerAsyncFactory', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    const { getByTestId } = render(ReactiveEagerAsyncTestWrapper, {
      props: { reactiveEagerAsync: chimericEagerAsync },
    });

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    const { getByTestId } = render(ReactiveEagerAsyncTestWrapper, {
      props: {
        reactiveEagerAsync: chimericEagerAsync,
        params: { name: 'John' },
      },
    });

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    const { getByTestId } = render(ReactiveEagerAsyncTestWrapper, {
      props: { reactiveEagerAsync: chimericEagerAsync },
    });

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('Hello');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: enabled = false does not run', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    const { getByTestId } = render(ReactiveEagerAsyncTestWrapper, {
      props: { reactiveEagerAsync: chimericEagerAsync, enabled: false },
    });

    // Should stay idle since enabled is false
    expect(getByTestId('isIdle').textContent).toBe('true');
    expect(fn).not.toHaveBeenCalled();
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const result = await chimericEagerAsync();

    expect(result).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
    const result = await chimericEagerAsync({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    const result1 = await chimericEagerAsync();
    expect(result1).toBe('Hello');
    expect(fn).toHaveBeenCalled();

    const result2 = await chimericEagerAsync({ name: 'Jane' });
    expect(result2).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const { fn } = EagerAsyncTestFixtures.withoutParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      await chimericEagerAsync({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const { fn } = EagerAsyncTestFixtures.withParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      await chimericEagerAsync();
      // @ts-expect-error - Testing type error
      await chimericEagerAsync({ wrong: 'param' });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const { fn } = EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });

    try {
      // @ts-expect-error - Testing type error
      await chimericEagerAsync({ wrong: 'param' });
      await chimericEagerAsync();
    } catch {
      // Expected error
    }
  });

  // ANNOTATIONS
  it('ANNOTATIONS: no params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });

  it('ANNOTATIONS: with optional params', async () => {
    const { annotation: _annotation, fn } =
      EagerAsyncTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = ChimericEagerAsyncFactory({
      eagerAsyncFn: fn,
    });
    expect(testAnnotation).toBeDefined();
  });
});
