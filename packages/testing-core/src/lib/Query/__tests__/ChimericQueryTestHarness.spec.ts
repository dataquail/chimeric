import { fuseChimericQuery } from '@chimeric/core';
import { ChimericQueryTestHarness } from '../ChimericQueryTestHarness';

describe('ChimericQueryTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticQuery = vi.fn(() => Promise.resolve('test'));
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

    const chimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    ChimericQueryTestHarness({
      chimericQuery,
      params: { id: '123' }, // should be ts error
      method: 'reactive',
    });

    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
  });

  it('should handle params', () => {
    const mockIdiomaticQuery = vi.fn((args: { id: string }) =>
      Promise.resolve('test'),
    );
    const mockReactiveQuery = {
      useQuery: vi.fn((args: { id: string }) => ({
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

    ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      }),
      method: 'reactive',
      params: { id: '123' },
    });

    expect(mockReactiveQuery.useQuery).toHaveBeenCalledWith({ id: '123' });
    expect(mockReactiveQuery.useQuery).toHaveBeenCalledTimes(1);
  });
});
