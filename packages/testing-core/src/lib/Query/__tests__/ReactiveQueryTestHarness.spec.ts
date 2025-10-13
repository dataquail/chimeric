import { QueryTestFixtures } from '../../__tests__/queryFixtures';
import { ReactiveQueryTestHarness } from '../ReactiveQueryTestHarness';

describe('ReactiveQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', () => {
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();

    ReactiveQueryTestHarness({
      reactiveQuery,
    });

    expect(reactiveQuery.use).toHaveBeenCalled();

    ReactiveQueryTestHarness({
      reactiveQuery,
      options: { enabled: false },
      nativeOptions: { staleTime: 1000 },
    });

    expect(reactiveQuery.use).toHaveBeenCalledTimes(2);
    expect(reactiveQuery.use).toHaveBeenCalledWith({
      options: { enabled: false },
      nativeOptions: { staleTime: 1000 },
    });
  });

  it('USAGE: with params', () => {
    const { reactiveQuery } = QueryTestFixtures.withParams.getReactive();

    ReactiveQueryTestHarness({
      reactiveQuery,
      params: { name: 'John' },
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveQuery.use).toHaveBeenCalledTimes(1);

    ReactiveQueryTestHarness({
      reactiveQuery,
      params: { name: 'John' },
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: { enabled: false },
        nativeOptions: undefined,
      },
    );
    expect(reactiveQuery.use).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with optional params', () => {
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    ReactiveQueryTestHarness({
      reactiveQuery,
      params: { name: 'Jane' },
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith({ name: 'Jane' });
    expect(reactiveQuery.use).toHaveBeenCalledTimes(1);

    ReactiveQueryTestHarness({
      reactiveQuery,
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith(undefined);
    expect(reactiveQuery.use).toHaveBeenCalledTimes(2);

    ReactiveQueryTestHarness({
      reactiveQuery,
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith(undefined, {
      options: { enabled: false },
      nativeOptions: undefined,
    });
    expect(reactiveQuery.use).toHaveBeenCalledTimes(3);

    ReactiveQueryTestHarness({
      reactiveQuery,
      params: { name: 'Jane' },
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith(
      { name: 'Jane' },
      {
        options: { enabled: false },
        nativeOptions: undefined,
      },
    );
    expect(reactiveQuery.use).toHaveBeenCalledTimes(4);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error - should error because params are not expected
      ReactiveQueryTestHarness({
        reactiveQuery,
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveQuery } = QueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error - should error because params are expected
      ReactiveQueryTestHarness({
        reactiveQuery,
      });

      ReactiveQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        reactiveQuery,
        params: { wrong: 'param' },
      });

      ReactiveQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        reactiveQuery,
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error - should error because wrong params
      ReactiveQueryTestHarness({
        reactiveQuery,
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ReactiveQueryTestHarness({
        reactiveQuery,
        params: 1,
      });

      ReactiveQueryTestHarness({
        reactiveQuery,
      });
    } catch {
      // Expected errors
    }
  });
});
