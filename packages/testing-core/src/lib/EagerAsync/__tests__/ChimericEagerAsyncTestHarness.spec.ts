import { fuseChimericEagerAsync } from '@chimeric/core';
import { ChimericEagerAsyncTestHarness } from '../ChimericEagerAsyncTestHarness';
import {
  makeReactiveEagerAsyncWithoutParamsReturnsString,
  makeReactiveEagerAsyncWithParamsReturnsString,
  makeIdiomaticEagerAsyncWithoutParamsReturnsString,
  makeIdiomaticEagerAsyncWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';

describe('ChimericEagerAsyncTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticQuery =
      makeIdiomaticEagerAsyncWithoutParamsReturnsString();
    const mockReactiveQuery =
      makeReactiveEagerAsyncWithoutParamsReturnsString();

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    ChimericEagerAsyncTestHarness({
      chimericEagerAsync,
      method: 'reactive',
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);
  });

  it('should handle params', () => {
    const mockIdiomaticQuery = makeIdiomaticEagerAsyncWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveEagerAsyncWithParamsReturnsString();

    ChimericEagerAsyncTestHarness({
      chimericEagerAsync: fuseChimericEagerAsync({
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
