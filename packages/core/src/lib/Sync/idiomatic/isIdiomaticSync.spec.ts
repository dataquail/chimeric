/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncTestFixtures } from '../__tests__/syncFixtures';
import { isIdiomaticSync } from './isIdiomaticSync';

describe('isIdiomaticSync', () => {
  it('should return true for a function', () => {
    const testIdiomaticSync =
      SyncTestFixtures.withoutParams.getIdiomatic().idiomaticSync;
    expect(isIdiomaticSync(testIdiomaticSync)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticSync('not a function' as any)).toBe(false);
    expect(isIdiomaticSync(123 as any)).toBe(false);
    expect(isIdiomaticSync({} as any)).toBe(false);
    expect(isIdiomaticSync(null as any)).toBe(false);
    expect(isIdiomaticSync(undefined as any)).toBe(false);
  });
});
