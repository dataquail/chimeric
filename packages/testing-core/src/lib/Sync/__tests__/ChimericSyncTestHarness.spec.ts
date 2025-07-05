import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/core';
import { ChimericSyncTestHarness } from '../ChimericSyncTestHarness';
import {
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
    const mockIdiomaticQuery = makeSyncFnWithParamsReturnsString();
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
  });
});
