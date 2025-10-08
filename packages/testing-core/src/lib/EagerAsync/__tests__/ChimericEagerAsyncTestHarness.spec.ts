import { fuseChimericEagerAsync } from '@chimeric/core';
import { ChimericEagerAsyncTestHarness } from '../ChimericEagerAsyncTestHarness';
import {
  makeReactiveEagerAsyncWithoutParamsReturnsString,
  makeReactiveEagerAsyncWithParamsReturnsString,
  makeIdiomaticEagerAsyncWithoutParamsReturnsString,
  makeIdiomaticEagerAsyncWithParamsReturnsString,
  makeIdiomaticEagerAsyncWithOptionalParamsReturnsString,
  makeReactiveEagerAsyncWithOptionalParamsReturnsString,
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

  it('should handle optional params', () => {
    const mockIdiomaticQuery =
      makeIdiomaticEagerAsyncWithOptionalParamsReturnsString();
    const mockReactiveQuery =
      makeReactiveEagerAsyncWithOptionalParamsReturnsString();

    const noParamsResult = ChimericEagerAsyncTestHarness({
      chimericEagerAsync: fuseChimericEagerAsync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith(undefined);
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);
    expect(noParamsResult.result.current.data).toEqual('Hello');

    const paramsResult = ChimericEagerAsyncTestHarness({
      chimericEagerAsync: fuseChimericEagerAsync({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(2);
    expect(paramsResult.result.current.data).toEqual('Hello John');
  });
});
