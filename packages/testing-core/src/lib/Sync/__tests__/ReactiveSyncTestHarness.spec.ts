import { createReactiveSync } from '@chimeric/core';
import {
  makeSyncFnWithOptionalParamsReturnsString,
  makeSyncFnWithoutParamsReturnsString,
  makeSyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { ReactiveSyncTestHarness } from '../ReactiveSyncTestHarness';

describe('ReactiveSyncTestHarness', () => {
  it('should handle no params', async () => {
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    ReactiveSyncTestHarness({
      reactiveSync: mockReactiveSync,
    });

    expect(mockReactiveSync.use).toHaveBeenCalledTimes(1);
  });

  it('should handle params', async () => {
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithParamsReturnsString(),
    );
    const testHarness = ReactiveSyncTestHarness({
      reactiveSync: mockReactiveSync,
      params: { name: 'John' },
    });

    expect(testHarness.result.current).toBe('Hello John');
    expect(mockReactiveSync.use).toHaveBeenCalledTimes(1);
    expect(mockReactiveSync.use).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should handle optional params', async () => {
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithOptionalParamsReturnsString(),
    );
    const testHarness = ReactiveSyncTestHarness({
      reactiveSync: mockReactiveSync,
      params: { name: 'John' },
    });

    expect(testHarness.result.current).toBe('Hello John');
    expect(mockReactiveSync.use).toHaveBeenCalledTimes(1);
    expect(mockReactiveSync.use).toHaveBeenCalledWith({
      name: 'John',
    });

    const testHarnessNoParams = ReactiveSyncTestHarness({
      reactiveSync: mockReactiveSync,
    });

    expect(testHarnessNoParams.result.current).toBe('Hello');
    expect(mockReactiveSync.use).toHaveBeenCalledTimes(2);
    expect(mockReactiveSync.use).toHaveBeenCalledWith(undefined);

    try {
      // @ts-expect-error Testing invalid usage
      ReactiveSyncTestHarness({
        reactiveSync: mockReactiveSync,
        params: 1,
      });
    } catch (e) {}
  });
});
