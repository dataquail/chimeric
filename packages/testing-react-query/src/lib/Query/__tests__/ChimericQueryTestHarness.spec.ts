import { fuseChimericQuery } from '@chimeric/react-query';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericQueryTestHarness } from '@chimeric/testing-core';
import { QueryTestFixtures } from '../../__tests__/queryFixtures';

describe('ChimericQueryTestHarness', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('Hello John');
  });

  it('USAGE: IDIOMATIC: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('Hello');
  });

  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
  });

  it('USAGE: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
  });

  it('USAGE: REACTIVE: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('Hello John');
  });

  it('USAGE: REACTIVE: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.data).toBe('Hello');
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric(queryClient);

    try {
      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
        // @ts-expect-error - should error because params are not expected
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because params are expected
      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
      });

      ChimericQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because wrong params
      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });

      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric(queryClient);

    try {
      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
        // @ts-expect-error - should error because params are not expected
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because params are expected
      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
      });

      ChimericQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because wrong params
      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });

      ChimericQueryTestHarness({
        chimericQuery: fuseChimericQuery({
          idiomatic: idiomaticQuery,
          reactive: reactiveQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });
});
