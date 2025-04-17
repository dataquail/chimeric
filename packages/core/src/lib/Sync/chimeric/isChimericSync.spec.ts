/* eslint-disable @typescript-eslint/no-explicit-any */
import { isChimericSync } from './isChimericSync';

describe('isChimericSync', () => {
  it('should return true for a chimeric sync function', () => {
    const mockChimericSync = vi.fn(() => 'test') as any;
    mockChimericSync.useSync = vi.fn(() => 'test');

    expect(isChimericSync(mockChimericSync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericSync('not a function')).toBe(false);

    // Function without useSync
    const mockSyncFn = vi.fn(() => 'test');
    expect(isChimericSync(mockSyncFn)).toBe(false);

    // Object with useSync but not a function
    const mockReactiveSync = {
      useSync: vi.fn(() => 'test'),
    };
    expect(isChimericSync(mockReactiveSync)).toBe(false);

    // Other invalid inputs
    expect(isChimericSync(123)).toBe(false);
    expect(isChimericSync(null)).toBe(false);
    expect(isChimericSync(undefined)).toBe(false);
    expect(isChimericSync({})).toBe(false);
  });
});
