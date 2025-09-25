/* eslint-disable @typescript-eslint/no-explicit-any */
import { markReactive } from './markReactive';
import { TYPE_MARKERS } from './typeMarkers';

describe('markReactive', () => {
  it('should mark an object with a reactive marker', () => {
    const obj = { use: () => 'test' };
    const marked = markReactive(obj, TYPE_MARKERS.REACTIVE_QUERY);

    expect(marked).toBe(obj); // Should return the same object
    expect('reactive' in marked).toBe(true);
    expect((marked as any).reactive).toBe(TYPE_MARKERS.REACTIVE_QUERY);
  });

  it('should mark a function with a reactive marker', () => {
    const fn = () => undefined;
    (fn as any).use = () => 'test';
    const marked = markReactive(fn as any, TYPE_MARKERS.REACTIVE_SYNC);

    expect(marked).toBe(fn); // Should return the same object
    expect('reactive' in marked).toBe(true);
    expect((marked as any).reactive).toBe(TYPE_MARKERS.REACTIVE_SYNC);
  });

  it('should make the reactive property non-enumerable', () => {
    const obj = { use: () => 'test', data: 'value' };
    const marked = markReactive(obj, TYPE_MARKERS.REACTIVE_QUERY);

    const keys = Object.keys(marked);
    expect(keys).toContain('use');
    expect(keys).toContain('data');
    expect(keys).not.toContain('reactive');

    // But it should still be accessible
    expect((marked as any).reactive).toBe(TYPE_MARKERS.REACTIVE_QUERY);
  });

  it('should make the reactive property non-writable', () => {
    const obj = { use: () => 'test' };
    const marked = markReactive(obj, TYPE_MARKERS.REACTIVE_QUERY);

    // Try to modify the property
    try {
      (marked as any).reactive = TYPE_MARKERS.REACTIVE_MUTATION;
    } catch (e) {
      // In strict mode, this would throw
      console.error(e);
    }

    // Should still have the original value
    expect((marked as any).reactive).toBe(TYPE_MARKERS.REACTIVE_QUERY);
  });

  it('should make the reactive property non-configurable', () => {
    const obj = { use: () => 'test' };
    const marked = markReactive(obj, TYPE_MARKERS.REACTIVE_QUERY);

    // Verify the property descriptor
    const descriptor = Object.getOwnPropertyDescriptor(marked, 'reactive');
    expect(descriptor?.configurable).toBe(false);

    // Should still have the property
    expect((marked as any).reactive).toBe(TYPE_MARKERS.REACTIVE_QUERY);
  });

  it('should work with different marker types', () => {
    const obj1 = { use: () => 'test1' };
    const obj2 = { use: () => 'test2' };
    const obj3 = { use: () => 'test3' };

    markReactive(obj1, TYPE_MARKERS.REACTIVE_QUERY);
    markReactive(obj2, TYPE_MARKERS.REACTIVE_MUTATION);
    markReactive(obj3, TYPE_MARKERS.REACTIVE_ASYNC);

    expect((obj1 as any).reactive).toBe(TYPE_MARKERS.REACTIVE_QUERY);
    expect((obj2 as any).reactive).toBe(TYPE_MARKERS.REACTIVE_MUTATION);
    expect((obj3 as any).reactive).toBe(TYPE_MARKERS.REACTIVE_ASYNC);
  });
});
