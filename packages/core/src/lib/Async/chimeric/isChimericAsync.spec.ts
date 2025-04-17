/* eslint-disable @typescript-eslint/no-explicit-any */
import { isChimericAsync } from './isChimericAsync';

describe('isChimericAsync', () => {
  it('should return true for a chimeric async function', () => {
    const mockChimericAsync = vi.fn(async () => 'test') as any;
    mockChimericAsync.useAsync = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isChimericAsync(mockChimericAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericAsync('not a function')).toBe(false);

    // Function without useAsync
    const mockAsyncFn = vi.fn(async () => 'test');
    expect(isChimericAsync(mockAsyncFn)).toBe(false);

    // Object with useAsync but not a function
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
    expect(isChimericAsync(mockReactiveAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericAsync(123)).toBe(false);
    expect(isChimericAsync(null)).toBe(false);
    expect(isChimericAsync(undefined)).toBe(false);
    expect(isChimericAsync({})).toBe(false);
  });
});
