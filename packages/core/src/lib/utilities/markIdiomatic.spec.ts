/* eslint-disable @typescript-eslint/no-explicit-any */
import { markIdiomatic } from './markIdiomatic';
import { TYPE_MARKERS } from './typeMarkers';

describe('markIdiomatic', () => {
  it('should mark a function with an idiomatic marker', () => {
    const fn = () => 'test';
    const marked = markIdiomatic(fn, TYPE_MARKERS.IDIOMATIC_QUERY);

    expect(marked).toBe(fn); // Should return the same object
    expect('idiomatic' in marked).toBe(true);
    expect((marked as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_QUERY);
  });

  it('should mark an object with an idiomatic marker', () => {
    const obj = { test: 'value' };
    const marked = markIdiomatic(obj, TYPE_MARKERS.IDIOMATIC_SYNC);

    expect(marked).toBe(obj); // Should return the same object
    expect('idiomatic' in marked).toBe(true);
    expect((marked as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_SYNC);
  });

  it('should make the idiomatic property non-enumerable', () => {
    const fn = () => 'test';
    const marked = markIdiomatic(fn, TYPE_MARKERS.IDIOMATIC_QUERY);

    const keys = Object.keys(marked);
    expect(keys).not.toContain('idiomatic');

    // But it should still be accessible
    expect((marked as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_QUERY);
  });

  it('should make the idiomatic property non-writable', () => {
    const fn = () => 'test';
    const marked = markIdiomatic(fn, TYPE_MARKERS.IDIOMATIC_QUERY);

    // Try to modify the property
    try {
      (marked as any).idiomatic = TYPE_MARKERS.IDIOMATIC_MUTATION;
    } catch (e) {
      // In strict mode, this would throw
      console.error(e);
    }

    // Should still have the original value
    expect((marked as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_QUERY);
  });

  it('should make the idiomatic property non-configurable', () => {
    const fn = () => 'test';
    const marked = markIdiomatic(fn, TYPE_MARKERS.IDIOMATIC_QUERY);

    // Verify the property descriptor
    const descriptor = Object.getOwnPropertyDescriptor(marked, 'idiomatic');
    expect(descriptor?.configurable).toBe(false);

    // Should still have the property
    expect((marked as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_QUERY);
  });

  it('should work with different marker types', () => {
    const fn1 = () => 'test1';
    const fn2 = () => 'test2';
    const fn3 = () => 'test3';

    markIdiomatic(fn1, TYPE_MARKERS.IDIOMATIC_QUERY);
    markIdiomatic(fn2, TYPE_MARKERS.IDIOMATIC_MUTATION);
    markIdiomatic(fn3, TYPE_MARKERS.IDIOMATIC_ASYNC);

    expect((fn1 as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_QUERY);
    expect((fn2 as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_MUTATION);
    expect((fn3 as any).idiomatic).toBe(TYPE_MARKERS.IDIOMATIC_ASYNC);
  });
});
