/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncTestFixtures } from '../__tests__/syncFixtures';
import { isReactiveSync } from './isReactiveSync';

describe('isReactiveSync', () => {
  it('should return true for an object with use function', () => {
    const mockReactiveSync =
      SyncTestFixtures.withoutParams.getReactive().reactiveSync;
    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveSync('not an object' as any)).toBe(false);
    expect(isReactiveSync(123 as any)).toBe(false);
    expect(isReactiveSync(null as any)).toBe(false);
    expect(isReactiveSync(undefined as any)).toBe(false);
    expect(isReactiveSync({} as any)).toBe(false);
    expect(isReactiveSync({ notUse: 'something' } as any)).toBe(false);
    expect(isReactiveSync({ use: 'not a function' } as any)).toBe(false);
  });
});
