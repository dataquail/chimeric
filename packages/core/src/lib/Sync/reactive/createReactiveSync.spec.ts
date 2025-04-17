/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveSync } from './createReactiveSync';

describe('createReactiveSync', () => {
  it('should create a reactive sync function', () => {
    const mockReactiveFn = vi.fn(() => 'test');

    const reactiveSync = createReactiveSync(mockReactiveFn);

    expect(typeof reactiveSync).toBe('object');
    expect(reactiveSync).toHaveProperty('useSync');
    expect(typeof reactiveSync.useSync).toBe('function');
    expect(reactiveSync.useSync).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveSync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive sync');
  });
});
