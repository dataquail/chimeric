import { fuseChimericInfiniteQuery } from '@chimeric/core';
import { InfiniteQueryTestFixtures } from '../../__tests__/infiniteQueryFixtures';
import { ChimericInfiniteQueryTestHarness } from '../ChimericInfiniteQueryTestHarness';

describe('ChimericInfiniteQueryTestHarness', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'reactive',
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'reactive',
      params: { filter: 'active' },
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'active',
    });
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(1);
  });

  it('USAGE: REACTIVE: with optional params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'reactive',
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith(undefined);
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(1);

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'reactive',
      params: { filter: 'active' },
    });

    expect(reactiveInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'active',
    });
    expect(reactiveInfiniteQuery.use).toHaveBeenCalledTimes(2);
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric();

    const testHarness = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
    });

    await testHarness.waitFor(() =>
      expect(testHarness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(testHarness.result.current.data).toBeDefined();
    expect(testHarness.result.current.data?.pages).toHaveLength(2);
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric();

    const testHarness = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
      params: { filter: 'active' },
    });

    await testHarness.waitFor(() =>
      expect(testHarness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({ filter: 'active' });
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(testHarness.result.current.data).toBeDefined();
    expect(testHarness.result.current.data?.pages[0].data[0]).toBe(
      'Filtered active Item 1',
    );
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();

    const testHarnessNoParams = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
    });

    await testHarnessNoParams.waitFor(() =>
      expect(testHarnessNoParams.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith(undefined);
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(1);
    expect(testHarnessNoParams.result.current.data?.pages[0].data[0]).toBe(
      'All Items 1',
    );

    const testHarnessWithParams = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
      params: { filter: 'active' },
    });

    await testHarnessWithParams.waitFor(() =>
      expect(testHarnessWithParams.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({ filter: 'active' });
    expect(idiomaticInfiniteQuery).toHaveBeenCalledTimes(2);
    expect(testHarnessWithParams.result.current.data?.pages[0].data[0]).toBe(
      'Filtered active Item 1',
    );
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'reactive',
        // @ts-expect-error - should error because params are not expected
        params: { filter: 'active' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error - should error because params are expected
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'reactive',
      });

      ChimericInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericInfiniteQuery,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      ChimericInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericInfiniteQuery,
        method: 'reactive',
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error - should error because wrong params
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'reactive',
        params: 1,
      });

      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'reactive',
      });
    } catch {
      // Expected errors
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'idiomatic',
        // @ts-expect-error - should error because params are not expected
        params: { filter: 'active' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error - should error because params are expected
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'idiomatic',
      });

      ChimericInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericInfiniteQuery,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      ChimericInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericInfiniteQuery,
        method: 'idiomatic',
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();

    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error - should error because wrong params
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'idiomatic',
        params: 1,
      });

      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery,
        method: 'idiomatic',
      });
    } catch {
      // Expected errors
    }
  });
});
