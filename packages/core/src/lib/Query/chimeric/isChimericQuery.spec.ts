/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTestFixtures } from '../__tests__/queryFixtures';
import { fuseChimericQuery } from './fuseChimericQuery';
import { isChimericQuery } from './isChimericQuery';

describe('isChimericQuery', () => {
  it('should return true for a chimeric query function', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    expect(isChimericQuery(testChimericQuery)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();
    // Not a function
    expect(isChimericQuery('not a function' as any)).toBe(false);

    // Function without use
    expect(isChimericQuery(idiomaticQuery as any)).toBe(false);

    // Object with use but not a function
    expect(isChimericQuery(reactiveQuery as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericQuery(123 as any)).toBe(false);
    expect(isChimericQuery(null as any)).toBe(false);
    expect(isChimericQuery(undefined as any)).toBe(false);
    expect(isChimericQuery({} as any)).toBe(false);
  });
});
