import {
  ChimericSync,
  fuseChimericSync,
  createIdiomaticSync,
  createReactiveSync,
} from '@chimeric/core';

/**
 * Configuration for creating a ChimericSync with explicit idiomatic and reactive implementations.
 *
 * @template TParams - The parameter type
 * @template TResult - The result type
 */
export type CreateChimericSyncConfig<TParams, TResult> = {
  idiomatic: (params: TParams) => TResult;
  reactive: (params: TParams) => TResult;
};

/**
 * Creates a ChimericSync from explicit idiomatic and reactive implementations.
 *
 * This is a convenience function that wraps `fuseChimericSync`, `createIdiomaticSync`,
 * and `createReactiveSync` into a single call. Use this when you need full control
 * over both implementations, such as when using Zustand's `useShallow` or other
 * library-specific patterns.
 *
 * For simpler cases where you only need to define a selector, use `CreateChimericSyncFactory`
 * with an adapter instead.
 *
 * @example
 * import { createChimericSync } from '@chimeric/react';
 * import { useShallow } from 'zustand/react/shallow';
 *
 * const getOneById = createChimericSync({
 *   idiomatic: (args: { id: string }) => {
 *     const record = useStore.getState().dict[args.id];
 *     return record ? toDomain(record) : undefined;
 *   },
 *   reactive: (args: { id: string }) => {
 *     const record = useStore(useShallow((state) => state.dict[args.id]));
 *     return record ? toDomain(record) : undefined;
 *   },
 * });
 *
 * // Usage:
 * // Idiomatic: getOneById({ id: '123' })
 * // Reactive: getOneById.useHook({ id: '123' })
 */
export function createChimericSync<TParams = void, TResult = unknown>(
  config: CreateChimericSyncConfig<TParams, TResult>,
): ChimericSync<TParams, TResult> {
  return fuseChimericSync({
    idiomatic: createIdiomaticSync(config.idiomatic),
    reactive: createReactiveSync(config.reactive),
  });
}
