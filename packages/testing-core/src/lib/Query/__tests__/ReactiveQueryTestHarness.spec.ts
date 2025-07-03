import { ReactiveQueryTestHarness } from '../ReactiveQueryTestHarness';
import {
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../../__tests__/queryFixtures';

describe('ReactiveQueryTestHarness', () => {
  it('should be a function', () => {
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
    });

    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
  });

  it('should handle params', () => {
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      params: { name: 'John' },
    });

    expect(mockReactiveQuery.useQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveQuery.useQuery).toHaveBeenCalledTimes(1);
  });
});
