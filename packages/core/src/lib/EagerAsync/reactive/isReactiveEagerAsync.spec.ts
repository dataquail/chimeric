/* eslint-disable @typescript-eslint/no-explicit-any */
import { isReactiveEagerAsync } from './isReactiveEagerAsync';

describe('isReactiveEagerAsync', () => {
  it('should return true for an object with useEagerAsync function', () => {
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return true for a function with useEagerAsync property', () => {
    const mockReactiveEagerAsync = vi.fn(() => 'test') as any;
    mockReactiveEagerAsync.useEagerAsync = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveEagerAsync('not an object')).toBe(false);
    expect(isReactiveEagerAsync(123)).toBe(false);
    expect(isReactiveEagerAsync(null)).toBe(false);
    expect(isReactiveEagerAsync(undefined)).toBe(false);
    expect(isReactiveEagerAsync({})).toBe(false);
    expect(isReactiveEagerAsync({ notUseEagerAsync: 'something' })).toBe(false);
    expect(isReactiveEagerAsync({ useEagerAsync: 'not a function' })).toBe(
      false,
    );
  });
});
