import { fuseChimericQuery } from '@chimeric/core';
import { QueryTestFixtures } from '../../__tests__/queryFixtures';
import { ChimericQueryTestHarness } from '../ChimericQueryTestHarness';

describe('ChimericQueryTestHarness', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    ChimericQueryTestHarness({
      chimericQuery,
      method: 'reactive',
    });

    expect(reactiveQuery.use).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric();

    ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveQuery.use).toHaveBeenCalledTimes(1);
  });

  it('USAGE: REACTIVE: with optional params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric();

    ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith(undefined);
    expect(reactiveQuery.use).toHaveBeenCalledTimes(1);

    ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(reactiveQuery.use).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveQuery.use).toHaveBeenCalledTimes(2);
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();

    const testHarness = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
    });

    await testHarness.waitFor(() =>
      expect(testHarness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(testHarness.result.current.data).toBe('test');
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric();

    const testHarness = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      params: { name: 'John' },
    });

    await testHarness.waitFor(() =>
      expect(testHarness.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(testHarness.result.current.data).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params', async () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric();

    const testHarnessNoParams = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
    });

    await testHarnessNoParams.waitFor(() =>
      expect(testHarnessNoParams.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticQuery).toHaveBeenCalledWith(undefined);
    expect(idiomaticQuery).toHaveBeenCalledTimes(1);
    expect(testHarnessNoParams.result.current.data).toBe('Hello');

    const testHarnessWithParams = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      params: { name: 'John' },
    });

    await testHarnessWithParams.waitFor(() =>
      expect(testHarnessWithParams.result.current.isSuccess).toBe(true),
    );

    expect(idiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticQuery).toHaveBeenCalledTimes(2);
    expect(testHarnessWithParams.result.current.data).toBe('Hello John');
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'reactive',
        // @ts-expect-error - should error because params are not expected
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error - should error because params are expected
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'reactive',
      });

      ChimericQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericQuery,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      ChimericQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericQuery,
        method: 'reactive',
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error - should error because wrong params
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'reactive',
        params: 1,
      });

      ChimericQueryTestHarness({
        chimericQuery,
        method: 'reactive',
      });
    } catch {
      // Expected errors
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'idiomatic',
        // @ts-expect-error - should error because params are not expected
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error - should error because params are expected
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'idiomatic',
      });

      ChimericQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericQuery,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      ChimericQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericQuery,
        method: 'idiomatic',
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric();

    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error - should error because wrong params
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      // @ts-expect-error - should error because wrong params
      ChimericQueryTestHarness({
        chimericQuery,
        method: 'idiomatic',
        params: 1,
      });

      ChimericQueryTestHarness({
        chimericQuery,
        method: 'idiomatic',
      });
    } catch {
      // Expected errors
    }
  });
});
