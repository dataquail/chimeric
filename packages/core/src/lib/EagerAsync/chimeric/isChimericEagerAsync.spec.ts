/* eslint-disable @typescript-eslint/no-explicit-any */
import { isChimericEagerAsync } from './isChimericEagerAsync';

describe('isChimericEagerAsync', () => {
  it('should return true for a chimeric eager async function', () => {
    const mockChimericEagerAsync = vi.fn(async () => 'test') as any;
    mockChimericEagerAsync.useEagerAsync = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isChimericEagerAsync(mockChimericEagerAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericEagerAsync('not a function')).toBe(false);

    // Function without useEagerAsync
    const mockAsyncFn = vi.fn(async () => 'test');
    expect(isChimericEagerAsync(mockAsyncFn)).toBe(false);

    // Object with useEagerAsync but not a function
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
    expect(isChimericEagerAsync(mockReactiveEagerAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericEagerAsync(123)).toBe(false);
    expect(isChimericEagerAsync(null)).toBe(false);
    expect(isChimericEagerAsync(undefined)).toBe(false);
    expect(isChimericEagerAsync({})).toBe(false);
  });
});
