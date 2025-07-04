import { createReactiveSync } from '@chimeric/core';
import {
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

    expect(mockReactiveSync.useSync).toHaveBeenCalledTimes(1);
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
    expect(mockReactiveSync.useSync).toHaveBeenCalledTimes(1);
    expect(mockReactiveSync.useSync).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
