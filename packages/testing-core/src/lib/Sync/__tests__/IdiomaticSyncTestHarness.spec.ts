import { SyncTestFixtures } from '../../__tests__/syncFixtures';
import { IdiomaticSyncTestHarness } from '../IdiomaticSyncTestHarness';

describe('IdiomaticSyncTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // USAGE
  it('USAGE: no params', () => {
    const { idiomaticSync } = SyncTestFixtures.withoutParams.getIdiomatic();
    const testHarness = IdiomaticSyncTestHarness({
      idiomaticSync,
    });

    expect(testHarness.result.current).toBe('test');
    expect(idiomaticSync).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', () => {
    const { idiomaticSync } = SyncTestFixtures.withParams.getIdiomatic();
    const testHarness = IdiomaticSyncTestHarness({
      idiomaticSync,
      params: { name: 'John' },
    });

    expect(testHarness.result.current).toBe('Hello John');
    expect(idiomaticSync).toHaveBeenCalledTimes(1);
    expect(idiomaticSync).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: with optional params', () => {
    const { idiomaticSync } =
      SyncTestFixtures.withOptionalParams.getIdiomatic();

    const testHarnessWithParams = IdiomaticSyncTestHarness({
      idiomaticSync,
      params: { name: 'John' },
    });

    expect(testHarnessWithParams.result.current).toBe('Hello John');
    expect(idiomaticSync).toHaveBeenCalledTimes(1);
    expect(idiomaticSync).toHaveBeenCalledWith({ name: 'John' });

    const testHarnessNoParams = IdiomaticSyncTestHarness({
      idiomaticSync,
    });

    expect(testHarnessNoParams.result.current).toBe('Hello');
    expect(idiomaticSync).toHaveBeenCalledTimes(2);
    expect(idiomaticSync).toHaveBeenCalledWith(undefined);
  });

  it('USAGE: reinvokeIdiomaticFn', async () => {
    let result: string | null = 'test1';
    const mockFn = vi.fn(() => result);
    const testHarness = IdiomaticSyncTestHarness({
      idiomaticSync: mockFn,
    });

    expect(testHarness.result.current).toBe('test1');

    wait(100).then(() => {
      result = 'test2';
    });

    try {
      // stays 'test1' until reinvoke
      await testHarness.waitFor(
        () => expect(testHarness.result.current).toBe('test2'),
        {
          timeout: 200,
        },
      );
    } catch (error: unknown) {
      expect((error as Error).message).toBe(
        `expected 'test1' to be 'test2' // Object.is equality`,
      );
    }

    await testHarness.waitFor(
      () => expect(testHarness.result.current).toBe('test2'),
      {
        reinvokeIdiomaticFn: true,
      },
    );

    expect(testHarness.result.current).toBe('test2');
    expect(mockFn).toHaveBeenCalled();
  });

  // TYPE ERRORS
  // TODO: fix failing type error test
  // it('TYPE ERRORS: no params', () => {
  //   const { idiomaticSync } = SyncTestFixtures.withoutParams.getIdiomatic();

  //   try {
  //     IdiomaticSyncTestHarness({
  //       // @ts-expect-error
  //       idiomaticSync,
  //       params: { name: 'John' },
  //     });
  //   } catch {
  //     // Expected error
  //   }
  // });

  it('TYPE ERRORS: with params', () => {
    const { idiomaticSync } = SyncTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error - Testing type error: params are required for sync with params
      IdiomaticSyncTestHarness({
        idiomaticSync,
      });

      IdiomaticSyncTestHarness({
        // @ts-expect-error - Testing type error: wrong param shape provided
        idiomaticSync,
        params: { wrong: 'param' },
      });

      IdiomaticSyncTestHarness({
        // @ts-expect-error - Testing type error: params must be an object not a number
        idiomaticSync,
        params: 1,
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', () => {
    const { idiomaticSync } =
      SyncTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error - Testing type error: wrong param shape provided
      IdiomaticSyncTestHarness({
        idiomaticSync,
        params: { wrong: 'param' },
      });

      IdiomaticSyncTestHarness({
        idiomaticSync,
        // @ts-expect-error - Testing type error: params must be an object not a number
        params: 1,
      });

      IdiomaticSyncTestHarness({
        idiomaticSync,
      });
    } catch {
      // Expected errors
    }
  });
});
