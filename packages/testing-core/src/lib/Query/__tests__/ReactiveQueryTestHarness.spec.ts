import { ReactiveQueryTestHarness } from '../ReactiveQueryTestHarness';

describe('ReactiveQueryTestHarness', () => {
  it('should be a function', () => {
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(),
        native: {},
      })),
    };

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
    });

    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
  });

  it('should handle params', () => {
    const mockReactiveQuery = {
      useQuery: vi.fn((_args: { id: string }) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(),
        native: {},
      })),
    };

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      params: { id: '123' },
    });

    expect(mockReactiveQuery.useQuery).toHaveBeenCalledWith({ id: '123' });
    expect(mockReactiveQuery.useQuery).toHaveBeenCalledTimes(1);
  });
});
