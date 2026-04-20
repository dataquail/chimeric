import { render, waitFor } from '@testing-library/svelte';
import { QueryClient, queryOptions } from '@tanstack/svelte-query';
import { ChimericSyncFactory } from '@chimeric/svelte';
import { ReactiveAsyncReducer } from './ReactiveAsyncReducer.svelte';
import { ReactiveQueryFactory } from '../../Query/reactive/ReactiveQueryFactory.svelte';
import ReactiveAsyncReducerTestWrapper from '../../__tests__/ReactiveAsyncReducerTestWrapper.svelte';

describe('ReactiveAsyncReducer', () => {
  it('should be defined', () => {
    expect(ReactiveAsyncReducer).toBeDefined();
  });

  it('should aggregate a no-params query + no-params sync service', async () => {
    const queryClient = new QueryClient();

    // Reactive query: resolves to a list of todo IDs
    const activeTodosQuery = ReactiveQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['todos'],
          queryFn: () => Promise.resolve(['todo-1', 'todo-2', 'todo-3']),
        }),
    });

    // Sync service: always returns a review with two of those IDs
    const reviewSync = ChimericSyncFactory(() => ({
      todoIdList: ['todo-1', 'todo-3'],
    }));

    const useCase = ReactiveAsyncReducer().build({
      serviceList: [
        { service: activeTodosQuery },
        { service: reviewSync },
      ],
      reducer: ([todos, review]) => {
        return todos.filter((id) => review.todoIdList.includes(id));
      },
    });

    const { getByTestId } = render(ReactiveAsyncReducerTestWrapper, {
      props: { reactiveEagerAsync: useCase },
    });

    // Initially the query is pending
    expect(getByTestId('isPending').textContent).toBe('true');
    expect(getByTestId('isSuccess').textContent).toBe('false');

    // Wait for the query to resolve
    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('isPending').textContent).toBe('false');
    expect(getByTestId('isError').textContent).toBe('false');
    expect(getByTestId('data').textContent).toBe('["todo-1","todo-3"]');
  });

  it('should provide partial data via initialValueReducer while pending', async () => {
    const queryClient = new QueryClient();

    const activeTodosQuery = ReactiveQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['todos-partial'],
          queryFn: () => Promise.resolve(['todo-a', 'todo-b']),
        }),
    });

    const reviewSync = ChimericSyncFactory(() => ({
      todoIdList: ['todo-a'],
    }));

    const useCase = ReactiveAsyncReducer().build({
      serviceList: [
        { service: activeTodosQuery },
        { service: reviewSync },
      ],
      reducer: ([todos, review]) => {
        return todos.filter((id) => review.todoIdList.includes(id));
      },
      initialValueReducer: ([_todos, review]) => {
        // While the query is loading, return the review ids as a placeholder
        return review.todoIdList;
      },
    });

    const { getByTestId } = render(ReactiveAsyncReducerTestWrapper, {
      props: { reactiveEagerAsync: useCase },
    });

    // While the query is pending, initialValueReducer supplies data
    expect(getByTestId('isPending').textContent).toBe('true');
    expect(getByTestId('data').textContent).toBe('["todo-a"]');

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    // After loading the full reducer runs
    expect(getByTestId('data').textContent).toBe('["todo-a"]');
  });

  it('should handle two async (query) services', async () => {
    const queryClient = new QueryClient();

    const queryA = ReactiveQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['serviceA'],
          queryFn: () => Promise.resolve('hello'),
        }),
    });

    const queryB = ReactiveQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['serviceB'],
          queryFn: () => Promise.resolve('world'),
        }),
    });

    const useCase = ReactiveAsyncReducer().build({
      serviceList: [{ service: queryA }, { service: queryB }],
      reducer: ([a, b]) => `${a} ${b}`,
    });

    const { getByTestId } = render(ReactiveAsyncReducerTestWrapper, {
      props: { reactiveEagerAsync: useCase },
    });

    expect(getByTestId('isPending').textContent).toBe('true');

    await waitFor(() => {
      expect(getByTestId('isSuccess').textContent).toBe('true');
    });

    expect(getByTestId('data').textContent).toBe('"hello world"');
  });

  it('should propagate errors from async services', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const failingQuery = ReactiveQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['failing'],
          queryFn: () => Promise.reject(new Error('fetch failed')),
        }),
    });

    const useCase = ReactiveAsyncReducer().build({
      serviceList: [{ service: failingQuery }],
      reducer: ([data]) => data,
    });

    const { getByTestId } = render(ReactiveAsyncReducerTestWrapper, {
      props: { reactiveEagerAsync: useCase },
    });

    await waitFor(() => {
      expect(getByTestId('isError').textContent).toBe('true');
    });

    expect(getByTestId('error').textContent).toBe('fetch failed');
    expect(getByTestId('isSuccess').textContent).toBe('false');
  });
});
