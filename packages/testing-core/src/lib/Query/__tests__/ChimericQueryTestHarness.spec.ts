import { fuseChimericQuery } from '@chimeric/core';
import { ChimericQueryTestHarness } from '../ChimericQueryTestHarness';
import {
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeIdiomaticQueryWithParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../../__tests__/queryFixtures';

describe('ChimericQueryTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();

    const chimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    ChimericQueryTestHarness({
      chimericQuery,
      // params: { id: '123' }, // should be ts error
      method: 'reactive',
    });

    expect(mockReactiveQuery.use).toHaveBeenCalled();
  });

  it('should handle params', () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();

    ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
      params: { name: 'John' },
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);
  });
});
