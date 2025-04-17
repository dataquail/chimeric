/* eslint-disable @typescript-eslint/no-explicit-any */
import { isReactiveQuery } from './isReactiveQuery';

describe('isReactiveQuery', () => {
  it('should return true for an object with useQuery function', () => {
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

    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return true for a function with useQuery property', () => {
    const mockReactiveQuery = vi.fn(() => 'test') as any;
    mockReactiveQuery.useQuery = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
    }));

    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveQuery('not an object')).toBe(false);
    expect(isReactiveQuery(123)).toBe(false);
    expect(isReactiveQuery(null)).toBe(false);
    expect(isReactiveQuery(undefined)).toBe(false);
    expect(isReactiveQuery({})).toBe(false);
    expect(isReactiveQuery({ notUseQuery: 'something' })).toBe(false);
    expect(isReactiveQuery({ useQuery: 'not a function' })).toBe(false);
  });
});
