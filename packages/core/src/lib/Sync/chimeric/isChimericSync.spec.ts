/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyncTestFixtures } from '../__tests__/syncFixtures';
import { fuseChimericSync } from './fuseChimericSync';
import { isChimericSync } from './isChimericSync';

describe('isChimericSync', () => {
  it('should return true for a chimeric sync function', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    const testChimericSync = fuseChimericSync({
      idiomatic: idiomaticSync,
      reactive: reactiveSync,
    });

    expect(isChimericSync(testChimericSync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    const { idiomaticSync, reactiveSync } =
      SyncTestFixtures.withoutParams.getChimeric();
    // Not a function
    expect(isChimericSync('not a function' as any)).toBe(false);

    // Function without use
    expect(isChimericSync(idiomaticSync as any)).toBe(false);

    // Object with use but not a function
    expect(isChimericSync(reactiveSync as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericSync(123 as any)).toBe(false);
    expect(isChimericSync(null as any)).toBe(false);
    expect(isChimericSync(undefined as any)).toBe(false);
    expect(isChimericSync({} as any)).toBe(false);
  });
});
