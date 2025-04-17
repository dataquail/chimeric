/* eslint-disable @typescript-eslint/no-explicit-any */
import { isChimericQuery } from './isChimericQuery';

describe('isChimericQuery', () => {
  it('should return true for a chimeric query function', () => {
    const mockChimericQuery = vi.fn(async () => 'test') as any;
    mockChimericQuery.useQuery = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
    }));

    expect(isChimericQuery(mockChimericQuery)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericQuery('not a function')).toBe(false);

    // Function without useQuery
    const mockQueryFn = vi.fn(async () => 'test');
    expect(isChimericQuery(mockQueryFn)).toBe(false);

    // Object with useQuery but not a function
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(() => Promise.resolve('test')),
      })),
    };
    expect(isChimericQuery(mockReactiveQuery)).toBe(false);

    // Other invalid inputs
    expect(isChimericQuery(123)).toBe(false);
    expect(isChimericQuery(null)).toBe(false);
    expect(isChimericQuery(undefined)).toBe(false);
    expect(isChimericQuery({})).toBe(false);
  });
});
