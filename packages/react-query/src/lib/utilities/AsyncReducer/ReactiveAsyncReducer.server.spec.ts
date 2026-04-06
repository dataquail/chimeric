import { ReactiveAsyncReducer } from './ReactiveAsyncReducer.server';

describe('ReactiveAsyncReducerServer', () => {
  it('should be defined', () => {
    expect(ReactiveAsyncReducer).toBeDefined();
  });

  it('useHook throws for no params', () => {
    const reactiveReducer = ReactiveAsyncReducer().build<string>();

    expect(() => reactiveReducer.useHook()).toThrow(
      "@chimeric/react-query: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });

  it('useHook throws for with params', () => {
    type Params = { value: string };
    const reactiveReducer =
      ReactiveAsyncReducer<Params>().build<string>();

    expect(() => reactiveReducer.useHook({ value: 'test' })).toThrow(
      "@chimeric/react-query: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
    );
  });
});
