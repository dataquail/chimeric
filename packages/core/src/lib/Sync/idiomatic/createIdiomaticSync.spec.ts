/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticSync } from './createIdiomaticSync';

describe('createIdiomaticSync', () => {
  it('should create an idiomatic sync function', () => {
    const mockSyncFn = vi.fn(() => 'test');
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(typeof idiomaticSync).toBe('function');
    expect(idiomaticSync).toBe(mockSyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticSync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic sync');
  });
});
