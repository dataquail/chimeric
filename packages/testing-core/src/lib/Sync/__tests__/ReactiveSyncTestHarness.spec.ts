import { SyncTestFixtures } from '../../__tests__/syncFixtures';
import { ReactiveSyncTestHarness } from '../ReactiveSyncTestHarness';

describe('ReactiveSyncTestHarness', () => {
  // USAGE
  it('USAGE: no params', () => {
    const { reactiveSync } = SyncTestFixtures.withoutParams.getReactive();
    const testHarness = ReactiveSyncTestHarness({
      reactiveSync,
    });

    expect(testHarness.result.current).toBe('test');
    expect(reactiveSync.use).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', () => {
    const { reactiveSync } = SyncTestFixtures.withParams.getReactive();
    const testHarness = ReactiveSyncTestHarness({
      reactiveSync,
      params: { name: 'John' },
    });

    expect(testHarness.result.current).toBe('Hello John');
    expect(reactiveSync.use).toHaveBeenCalledTimes(1);
    expect(reactiveSync.use).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', () => {
    const { reactiveSync } = SyncTestFixtures.withOptionalParams.getReactive();

    const testHarnessWithParams = ReactiveSyncTestHarness({
      reactiveSync,
      params: { name: 'John' },
    });

    expect(testHarnessWithParams.result.current).toBe('Hello John');
    expect(reactiveSync.use).toHaveBeenCalledTimes(1);
    expect(reactiveSync.use).toHaveBeenCalledWith({ name: 'John' });

    const testHarnessNoParams = ReactiveSyncTestHarness({
      reactiveSync,
    });

    expect(testHarnessNoParams.result.current).toBe('Hello');
    expect(reactiveSync.use).toHaveBeenCalledTimes(2);
    expect(reactiveSync.use).toHaveBeenCalledWith(undefined);
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', () => {
    const { reactiveSync } = SyncTestFixtures.withoutParams.getReactive();

    try {
      ReactiveSyncTestHarness({
        reactiveSync,
        // @ts-expect-error - Testing type error: params should not be provided for sync without params
        params: { name: 'John' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', () => {
    const { reactiveSync } = SyncTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error - Testing type error: params are required for sync with params
      ReactiveSyncTestHarness({
        reactiveSync,
      });

      ReactiveSyncTestHarness({
        // @ts-expect-error - Testing type error: wrong param shape provided
        reactiveSync,
        params: { wrong: 'param' },
      });

      ReactiveSyncTestHarness({
        // @ts-expect-error - Testing type error: params must be an object not a number
        reactiveSync,
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { reactiveSync } = SyncTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error - Testing type error: wrong param shape provided
      ReactiveSyncTestHarness({
        reactiveSync,
        params: { wrong: 'param' },
      });

      // @ts-expect-error - Testing type error: params must be an object not a number
      ReactiveSyncTestHarness({
        reactiveSync,
        params: 1,
      });

      ReactiveSyncTestHarness({
        reactiveSync,
      });
    } catch {
      // Expected errors
    }
  });
});
