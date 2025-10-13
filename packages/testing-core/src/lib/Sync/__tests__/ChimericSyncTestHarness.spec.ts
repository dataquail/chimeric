import { fuseChimericSync } from '@chimeric/core';
import { SyncTestFixtures } from '../../__tests__/syncFixtures';
import { ChimericSyncTestHarness } from '../ChimericSyncTestHarness';

describe('ChimericSyncTestHarness', () => {
  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    const testHarness = ChimericSyncTestHarness({
      chimericSync,
      method: 'reactive',
    });

    expect(testHarness.result.current).toBe('test');
    expect(reactiveSync.use).toHaveBeenCalledTimes(1);
    expect(reactiveSync.use).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: REACTIVE: with params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    const testHarness = ChimericSyncTestHarness({
      chimericSync,
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(testHarness.result.current).toBe('Hello John');
    expect(reactiveSync.use).toHaveBeenCalledTimes(1);
    expect(reactiveSync.use).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: with optional params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    const testHarnessWithParams = ChimericSyncTestHarness({
      chimericSync,
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(testHarnessWithParams.result.current).toBe('Hello John');
    expect(reactiveSync.use).toHaveBeenCalledTimes(1);
    expect(reactiveSync.use).toHaveBeenCalledWith({ name: 'John' });

    const testHarnessNoParams = ChimericSyncTestHarness({
      chimericSync,
      method: 'reactive',
    });

    expect(testHarnessNoParams.result.current).toBe('Hello');
    expect(reactiveSync.use).toHaveBeenCalledTimes(2);
    expect(reactiveSync.use).toHaveBeenCalledWith(undefined);
  });

  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    const testHarness = ChimericSyncTestHarness({
      chimericSync,
      method: 'idiomatic',
    });

    expect(testHarness.result.current).toBe('test');
    expect(idiomaticSync).toHaveBeenCalledTimes(1);
    expect(idiomaticSync).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: IDIOMATIC: with params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    const testHarness = ChimericSyncTestHarness({
      chimericSync,
      method: 'idiomatic',
      params: { name: 'John' },
    });

    expect(testHarness.result.current).toBe('Hello John');
    expect(idiomaticSync).toHaveBeenCalledTimes(1);
    expect(idiomaticSync).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: IDIOMATIC: with optional params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    const testHarnessWithParams = ChimericSyncTestHarness({
      chimericSync,
      method: 'idiomatic',
      params: { name: 'John' },
    });

    expect(testHarnessWithParams.result.current).toBe('Hello John');
    expect(idiomaticSync).toHaveBeenCalledTimes(1);
    expect(idiomaticSync).toHaveBeenCalledWith({ name: 'John' });

    const testHarnessNoParams = ChimericSyncTestHarness({
      chimericSync,
      method: 'idiomatic',
    });

    expect(testHarnessNoParams.result.current).toBe('Hello');
    expect(idiomaticSync).toHaveBeenCalledTimes(2);
    expect(idiomaticSync).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      ChimericSyncTestHarness({
        chimericSync,
        method: 'reactive',
        // @ts-expect-error - Testing type error: params should not be provided for sync without params
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error - Testing type error: params are required for sync with params
      ChimericSyncTestHarness({
        chimericSync,
        method: 'reactive',
      });

      ChimericSyncTestHarness({
        // @ts-expect-error - Testing type error: wrong param shape provided
        chimericSync,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      ChimericSyncTestHarness({
        // @ts-expect-error - Testing type error: params must be an object not a number
        chimericSync,
        method: 'reactive',
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error - Testing type error: wrong param shape provided
      ChimericSyncTestHarness({
        chimericSync,
        method: 'reactive',
        params: { wrong: 'param' },
      });

      ChimericSyncTestHarness({
        chimericSync,
        method: 'reactive',
        // @ts-expect-error - Testing type error: params must be an object not a number
        params: 1,
      });

      ChimericSyncTestHarness({
        chimericSync,
        method: 'reactive',
      });
    } catch {
      // Expected errors
    }
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      ChimericSyncTestHarness({
        chimericSync,
        method: 'idiomatic',
        // @ts-expect-error - Testing type error: params should not be provided for sync without params
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error - Testing type error: params are required for sync with params
      ChimericSyncTestHarness({
        chimericSync,
        method: 'idiomatic',
      });

      ChimericSyncTestHarness({
        // @ts-expect-error - Testing type error: wrong param shape provided
        chimericSync,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      ChimericSyncTestHarness({
        // @ts-expect-error - Testing type error: params must be an object not a number
        chimericSync,
        method: 'idiomatic',
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withOptionalParams.getChimeric();
    const chimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    try {
      // @ts-expect-error - Testing type error: wrong param shape provided
      ChimericSyncTestHarness({
        chimericSync,
        method: 'idiomatic',
        params: { wrong: 'param' },
      });

      ChimericSyncTestHarness({
        chimericSync,
        method: 'idiomatic',
        // @ts-expect-error - Testing type error: params must be an object not a number
        params: 1,
      });

      ChimericSyncTestHarness({
        chimericSync,
        method: 'idiomatic',
      });
    } catch {
      // Expected errors
    }
  });
});
