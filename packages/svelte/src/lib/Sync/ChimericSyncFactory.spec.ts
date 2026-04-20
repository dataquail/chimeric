import { render, waitFor } from '@testing-library/svelte';
import { ChimericSyncFactory } from './ChimericSyncFactory';
import {
  SyncTestFixtures,
  createReactiveStore,
} from '../__tests__/syncFixtures.svelte';
import ReactiveSyncTestWrapper from '../__tests__/ReactiveSyncTestWrapper.svelte';

describe('ChimericSyncFactory', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', () => {
    const { fn } = SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = ChimericSyncFactory(fn);
    expect(chimericSync()).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: IDIOMATIC: with params', () => {
    const { fn } = SyncTestFixtures.withParams.getChimeric();
    const chimericSync = ChimericSyncFactory(fn);
    expect(chimericSync({ name: 'John' })).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', () => {
    const { fn } = SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = ChimericSyncFactory(fn);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync: chimericSync },
    });

    expect(getByTestId('current').textContent).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', () => {
    const { fn } = SyncTestFixtures.withParams.getChimeric();
    const chimericSync = ChimericSyncFactory(fn);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync: chimericSync, params: { name: 'John' } },
    });

    expect(getByTestId('current').textContent).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: updates when underlying $state changes', async () => {
    const store = createReactiveStore(0);
    const chimericSync = ChimericSyncFactory(() => store.value * 2);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync: chimericSync },
    });

    expect(getByTestId('current').textContent).toBe('0');
    // Idiomatic path sees the same snapshot
    expect(chimericSync()).toBe(0);

    store.set(5);

    await waitFor(() => {
      expect(getByTestId('current').textContent).toBe('10');
    });
    expect(chimericSync()).toBe(10);
  });

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', () => {
    const { fn } = SyncTestFixtures.withoutParams.getChimeric();
    const chimericSync = ChimericSyncFactory(fn);
    try {
      // @ts-expect-error - no params expected
      chimericSync({ name: 'John' });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', () => {
    const { fn } = SyncTestFixtures.withParams.getChimeric();
    const chimericSync = ChimericSyncFactory(fn);
    try {
      // @ts-expect-error - params required
      chimericSync();
      // @ts-expect-error - wrong param shape
      chimericSync({ wrong: 'param' });
    } catch {
      // Expected error
    }
  });
});
