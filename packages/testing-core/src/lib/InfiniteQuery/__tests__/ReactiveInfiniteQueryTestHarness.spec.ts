import { InfiniteQueryTestFixtures } from '../../__tests__/infiniteQueryFixtures';
import { ReactiveInfiniteQueryTestHarness } from '../ReactiveInfiniteQueryTestHarness';

describe('ReactiveInfiniteQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalled();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      options: { enabled: false },
      nativeOptions: { staleTime: 1000 },
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(2);
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith({
      options: { enabled: false },
      nativeOptions: { staleTime: 1000 },
    });
  });

  it('USAGE: with params', () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      params: { filter: 'active' },
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'active',
    });
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(1);

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      params: { filter: 'active' },
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith(
      { filter: 'active' },
      {
        options: { enabled: false },
        nativeOptions: undefined,
      },
    );
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with optional params', () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      params: { filter: 'active' },
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'active',
    });
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(1);

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith(undefined);
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(2);

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith(undefined, {
      options: { enabled: false },
      nativeOptions: undefined,
    });
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(3);

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      params: { filter: 'active' },
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith(
      { filter: 'active' },
      {
        options: { enabled: false },
        nativeOptions: undefined,
      },
    );
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(4);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error - should error because params are not expected
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        params: { filter: 'active' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error - should error because params are expected
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
      });

      ReactiveInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        reactiveInfiniteQuery,
        params: { wrong: 'param' },
      });

      ReactiveInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        reactiveInfiniteQuery,
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error - should error because wrong params
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        params: 1,
      });

      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
      });
    } catch {
      // Expected errors
    }
  });
});
