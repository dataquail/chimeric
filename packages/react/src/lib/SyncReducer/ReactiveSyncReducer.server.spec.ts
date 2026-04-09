import { ReactiveSyncReducer } from './ReactiveSyncReducer.server';

describe('ReactiveSyncReducerServer', () => {
  it('should be defined', () => {
    expect(ReactiveSyncReducer).toBeDefined();
  });

  it('useHook throws for no params', () => {
    const reactiveReducer = ReactiveSyncReducer().build<string>();

    expect(() => reactiveReducer.useHook()).toThrow(
      "@chimeric/react: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  it('useHook throws for with params', () => {
    type Params = { value: string };
    const reactiveReducer =
      ReactiveSyncReducer<Params>().build<string>();

    expect(() => reactiveReducer.useHook({ value: 'test' })).toThrow(
      "@chimeric/react: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });
});
