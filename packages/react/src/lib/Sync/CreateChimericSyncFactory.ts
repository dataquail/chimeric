import {
  ChimericSync,
  fuseChimericSync,
  createIdiomaticSync,
  createReactiveSync,
} from '@chimeric/core';

/**
 * Adapter type that bridges state management libraries with ChimericSync.
 *
 * @template TState - The full state type of the state management library
 *
 * @property getState - Idiomatic function to get current state synchronously
 * @property useSelector - Reactive hook that takes a selector function and an optional
 *   equality function, and subscribes to changes.
 */
export type ChimericSyncAdapter<TState> = {
  getState: () => TState;
  useSelector: <TSelected>(selector: (state: TState) => TSelected) => TSelected;
};

/**
 * Configuration for creating a ChimericSync instance using a selector factory.
 *
 * @template TState - The full state type
 * @template TParams - The parameter type for the selector factory
 * @template TSelected - The type returned by the selector
 * @template TResult - The final result type after optional reduction
 */
export type ChimericSyncFactoryConfig<TState, TParams, TSelected, TResult> = {
  selector: (params: TParams) => (state: TState) => TSelected;
  reducer?: (selected: TSelected, params: TParams) => TResult;
};

/**
 * Creates a ChimericSyncFactory bound to a specific state management adapter.
 *
 * This allows users to define ChimericSync instances in a streamlined way by
 * providing a selector factory function. The factory handles the dual-path
 * (idiomatic/reactive) creation automatically based on the adapter.
 *
 * ## Configuration
 * - **selector**: A function that takes params and returns a selector function.
 *   This pattern works well with memoized selector libraries like Redux Toolkit's createSelector.
 * - **reducer**: Optional transformation applied after selection (can create new object references safely)
 *
 * For cases requiring full control over both idiomatic and reactive implementations
 * (e.g., custom useShallow behavior), use `createChimericSync` directly instead.
 *
 * @example
 * // Redux adapter example
 * const chimericSyncFactory = CreateChimericSyncFactory({
 *   getState: () => appStore.getState(),
 *   useSelector: useAppSelector,
 * });
 *
 * // Zustand adapter example
 * const chimericSyncFactory = CreateChimericSyncFactory({
 *   getState: () => useMyStore.getState(),
 *   useSelector: useMyStore,
 * });
 *
 * // Simple selector
 * const getUserById = chimericSyncFactory({
 *   selector: (args: { id: string }) => (state) => state.users[args.id],
 *   reducer: (record) => record ? toDomain(record) : undefined,
 * });
 *
 * // Using createSelector for memoization
 * const selectTodoById = createSelector(
 *   [(state: RootState) => state.todos, (_state: RootState, id: string) => id],
 *   (todos, id) => todos[id] ? toDomain(todos[id]) : undefined
 * );
 *
 * const getTodoById = chimericSyncFactory({
 *   selector: (args: { id: string }) => (state) => selectTodoById(state, args.id),
 * });
 *
 * // Usage:
 * // Idiomatic: getUserById({ id: '123' })
 * // Reactive: getUserById.useHook({ id: '123' })
 */
export function CreateChimericSyncFactory<TState>(
  adapter: ChimericSyncAdapter<TState>,
) {
  function factory<TParams = void, TSelected = unknown, TResult = TSelected>(
    args: ChimericSyncFactoryConfig<TState, TParams, TSelected, TResult>,
  ): ChimericSync<TParams, TResult> {
    const { selector, reducer } = args;

    const idiomatic = createIdiomaticSync((params: TParams) => {
      const selectorFn = selector(params);
      const selected = selectorFn(adapter.getState());
      return (reducer ? reducer(selected, params) : selected) as TResult;
    });

    const reactive = createReactiveSync((params: TParams) => {
      const selectorFn = selector(params);
      const selected = adapter.useSelector(selectorFn);
      return (reducer ? reducer(selected, params) : selected) as TResult;
    });

    return fuseChimericSync({ idiomatic, reactive });
  }

  return factory;
}
