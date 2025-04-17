/* eslint-disable @typescript-eslint/no-explicit-any */
import { isReactiveAsync } from './isReactiveAsync';

describe('isReactiveAsync', () => {
  it('should return true for an object with useAsync function', () => {
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return true for a function with useAsync property', () => {
    const mockReactiveAsync = vi.fn(() => 'test') as any;
    mockReactiveAsync.useAsync = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveAsync('not an object')).toBe(false);
    expect(isReactiveAsync(123)).toBe(false);
    expect(isReactiveAsync(null)).toBe(false);
    expect(isReactiveAsync(undefined)).toBe(false);
    expect(isReactiveAsync({})).toBe(false);
    expect(isReactiveAsync({ notUseAsync: 'something' })).toBe(false);
    expect(isReactiveAsync({ useAsync: 'not a function' })).toBe(false);
  });
});
