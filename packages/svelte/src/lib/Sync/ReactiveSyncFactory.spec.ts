import { render, waitFor } from '@testing-library/svelte';
import { ReactiveSyncFactory } from './ReactiveSyncFactory.svelte';
import {
  SyncTestFixtures,
  createReactiveStore,
} from '../__tests__/syncFixtures.svelte';
import ReactiveSyncTestWrapper from '../__tests__/ReactiveSyncTestWrapper.svelte';

describe('ReactiveSyncFactory', () => {
  it('USAGE: REACTIVE: no params', () => {
    const { fn } = SyncTestFixtures.withoutParams.getReactive();
    const reactiveSync = ReactiveSyncFactory(fn);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync },
    });

    expect(getByTestId('current').textContent).toBe('test');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: with params', () => {
    const { fn } = SyncTestFixtures.withParams.getReactive();
    const reactiveSync = ReactiveSyncFactory(fn);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync, params: { name: 'John' } },
    });

    expect(getByTestId('current').textContent).toBe('Hello John');
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('USAGE: REACTIVE: optional params (without params)', () => {
    const { fn } = SyncTestFixtures.withOptionalParams.getReactive();
    const reactiveSync = ReactiveSyncFactory(fn);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync },
    });

    expect(getByTestId('current').textContent).toBe('Hello');
    expect(fn).toHaveBeenCalled();
  });

  it('USAGE: REACTIVE: optional params (with params)', () => {
    const { fn } = SyncTestFixtures.withOptionalParams.getReactive();
    const reactiveSync = ReactiveSyncFactory(fn);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync, params: { name: 'Jane' } },
    });

    expect(getByTestId('current').textContent).toBe('Hello Jane');
    expect(fn).toHaveBeenCalledWith({ name: 'Jane' });
  });

  it('USAGE: REACTIVE: updates when underlying $state changes', async () => {
    const store = createReactiveStore('alpha');
    const reactiveSync = ReactiveSyncFactory(() => store.value);

    const { getByTestId } = render(ReactiveSyncTestWrapper, {
      props: { reactiveSync },
    });

    expect(getByTestId('current').textContent).toBe('alpha');

    store.set('beta');

    await waitFor(() => {
      expect(getByTestId('current').textContent).toBe('beta');
    });
  });

  it('ANNOTATIONS: no params', () => {
    const { annotation: _annotation, fn } =
      SyncTestFixtures.withoutParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const reactiveSync: TestAnnotation = ReactiveSyncFactory(fn);
    expect(reactiveSync).toBeDefined();
  });

  it('ANNOTATIONS: with params', () => {
    const { annotation: _annotation, fn } =
      SyncTestFixtures.withParams.getReactive();
    type TestAnnotation = typeof _annotation;
    const reactiveSync: TestAnnotation = ReactiveSyncFactory(fn);
    expect(reactiveSync).toBeDefined();
  });
});
