import { ReactiveInfiniteQueryTestHarness } from '../ReactiveInfiniteQueryTestHarness';
import {
  makeReactiveInfiniteQueryWithoutParams,
  makeReactiveInfiniteQueryWithParams,
} from '../../__tests__/infiniteQueryFixtures';

describe('ReactiveInfiniteQueryTestHarness', () => {
  it('should call the reactive infinite query use function', () => {
    const mockReactiveInfiniteQuery = makeReactiveInfiniteQueryWithoutParams();
    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery: mockReactiveInfiniteQuery,
    });

    expect(mockReactiveInfiniteQuery.use).toHaveBeenCalled();
  });

  it('should handle params', () => {
    const mockReactiveInfiniteQuery = makeReactiveInfiniteQueryWithParams();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery: mockReactiveInfiniteQuery,
      params: { filter: 'active' },
    });

    expect(mockReactiveInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'active',
    });
    expect(mockReactiveInfiniteQuery.use).toHaveBeenCalledTimes(1);
  });

  it('should handle options', () => {
    const mockReactiveInfiniteQuery = makeReactiveInfiniteQueryWithoutParams();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery: mockReactiveInfiniteQuery,
      options: {
        enabled: false,
      },
    });

    expect(mockReactiveInfiniteQuery.use).toHaveBeenCalledWith({
      options: { enabled: false },
      nativeOptions: undefined,
    });
  });

  it('should handle both params and options', () => {
    const mockReactiveInfiniteQuery = makeReactiveInfiniteQueryWithParams();

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery: mockReactiveInfiniteQuery,
      params: { filter: 'completed' },
      options: {
        enabled: true,
      },
    });

    expect(mockReactiveInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'completed',
      options: { enabled: true },
      nativeOptions: undefined,
    });
  });

  it('should handle native options', () => {
    const mockReactiveInfiniteQuery = makeReactiveInfiniteQueryWithoutParams();
    const nativeOptions = { staleTime: 5000 };

    ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery: mockReactiveInfiniteQuery,
      nativeOptions,
    });

    expect(mockReactiveInfiniteQuery.use).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions,
    });
  });
});
