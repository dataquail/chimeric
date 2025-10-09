import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/core';
import { ChimericSyncTestHarness } from '../ChimericSyncTestHarness';
import {
  makeSyncFnWithOptionalParamsReturnsString,
  makeSyncFnWithoutParamsReturnsString,
  makeSyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('ChimericSyncTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticQuery = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const mockReactiveQuery = createReactiveSync(
      makeSyncFnWithoutParamsReturnsString(),
    );

    const chimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    ChimericSyncTestHarness({
      chimericSync,
      method: 'reactive',
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);
  });

  it('should handle params', () => {
    const mockIdiomaticQuery = createIdiomaticSync(
      makeSyncFnWithParamsReturnsString(),
    );
    const mockReactiveQuery = createReactiveSync(
      makeSyncFnWithParamsReturnsString(),
    );

    ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith({
      name: 'John',
    });
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);

    ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'idiomatic',
      params: { name: 'John' },
    });

    expect(mockIdiomaticQuery).toHaveBeenCalledWith({
      name: 'John',
    });
    expect(mockIdiomaticQuery).toHaveBeenCalledTimes(1);

    try {
      // @ts-expect-error Testing invalid usage
      ChimericSyncTestHarness({
        chimericSync: fuseChimericSync({
          idiomatic: mockIdiomaticQuery,
          reactive: mockReactiveQuery,
        }),
        method: 'reactive',
      });
    } catch {
      // Expected error
    }
  });

  it('should handle optional params', async () => {
    const mockIdiomaticQuery = createIdiomaticSync(
      makeSyncFnWithOptionalParamsReturnsString(),
    );
    const mockReactiveQuery = createReactiveSync(
      makeSyncFnWithOptionalParamsReturnsString(),
    );

    const reactiveTestHarness = ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(reactiveTestHarness.result.current).toBe('Hello John');
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);
    expect(mockReactiveQuery.use).toHaveBeenCalledWith({
      name: 'John',
    });

    const reactiveTestHarnessNoParams = ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
    });

    expect(reactiveTestHarnessNoParams.result.current).toBe('Hello');
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(2);
    expect(mockReactiveQuery.use).toHaveBeenCalledWith(undefined);

    const idiomaticTestHarness = ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'idiomatic',
      params: { name: 'John' },
    });

    expect(idiomaticTestHarness.result.current).toBe('Hello John');
    expect(mockIdiomaticQuery).toHaveBeenCalledTimes(1);
    expect(mockIdiomaticQuery).toHaveBeenCalledWith({
      name: 'John',
    });

    const idiomaticTestHarnessNoParams = ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'idiomatic',
    });

    expect(idiomaticTestHarnessNoParams.result.current).toBe('Hello');
    expect(mockIdiomaticQuery).toHaveBeenCalledTimes(2);
    expect(mockIdiomaticQuery).toHaveBeenCalledWith(undefined);

    try {
      ChimericSyncTestHarness({
        chimericSync: fuseChimericSync({
          idiomatic: mockIdiomaticQuery,
          reactive: mockReactiveQuery,
        }),
        method: 'reactive',
        // @ts-expect-error Testing invalid usage
        params: 1,
      });
    } catch {
      // Expected error
    }
  });

  it('should handle no params', () => {
    const mockIdiomaticQuery = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const mockReactiveQuery = createReactiveSync(
      makeSyncFnWithoutParamsReturnsString(),
    );

    ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith(undefined);
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);

    ChimericSyncTestHarness({
      chimericSync: fuseChimericSync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'idiomatic',
    });

    expect(mockIdiomaticQuery).toHaveBeenCalledWith(undefined);
    expect(mockIdiomaticQuery).toHaveBeenCalledTimes(1);

    try {
      ChimericSyncTestHarness({
        chimericSync: fuseChimericSync({
          idiomatic: mockIdiomaticQuery,
          reactive: mockReactiveQuery,
        }),
        method: 'reactive',
        // @ts-expect-error Testing invalid usage
        params: 1,
      });
    } catch {
      // Expected error
    }
  });
});
