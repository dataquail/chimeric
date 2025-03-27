import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { mockGetAllActiveTodos } from 'src/__test__/network/activeTodo/mockGetAllActiveTodos';
import { mockCreateOneActiveTodo } from 'src/__test__/network/activeTodo/mockCreateOneActiveTodo';
import { mockDeleteOneActiveTodo } from 'src/__test__/network/activeTodo/mockDeleteOneActiveTodo';
import { mockCompleteOneActiveTodo } from 'src/__test__/network/activeTodo/mockCompleteOneActiveTodo';
import { mockUncompleteOneActiveTodo } from 'src/__test__/network/activeTodo/mockUncompleteOneActiveTodo';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import { mockGetOneActiveTodo } from 'src/__test__/network/activeTodo/mockGetOneActiveTodo';
import {
  ChimericQueryMethods,
  getChimericQueryTestHarness,
  inferQueryMethod,
  ChimericMutationMethods,
  getChimericMutationTestHarness,
} from '@chimeric/testing';

describe('ActiveTodoServiceImpl', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const getActiveTodoService = () => {
    return appContainer.get<InjectionType<'IActiveTodoService'>>(
      InjectionSymbol('IActiveTodoService'),
    );
  };

  const withOneUncompletedActiveTodoInList = () => {
    mockGetAllActiveTodos(server, {
      total_count: 1,
      list: [
        {
          id: '1',
          title: 'Active Todo 1',
          created_at: nowTimeStamp,
          completed_at: null,
        },
      ],
    });
  };

  const withOneUncompletedActiveTodo = () => {
    mockGetOneActiveTodo(server, {
      id: '1',
      title: 'Active Todo 1',
      created_at: nowTimeStamp,
      completed_at: null,
    });
  };

  const withOneCompletedActiveTodoInList = () => {
    mockGetAllActiveTodos(server, {
      total_count: 1,
      list: [
        {
          id: '1',
          title: 'Active Todo 1',
          created_at: nowTimeStamp,
          completed_at: nowTimeStamp,
        },
      ],
    });
  };

  const withNoActiveTodosInList = () => {
    mockGetAllActiveTodos(server, {
      total_count: 0,
      list: [],
    });
  };

  const withSuccessfullyCreatedActiveTodo = () =>
    mockCreateOneActiveTodo(server, {
      id: '1',
    });

  const withSuccessfullyDeletedActiveTodo = () =>
    mockDeleteOneActiveTodo(server, { message: 'success' });

  const withSuccessfullyCompletedActiveTodo = () =>
    mockCompleteOneActiveTodo(server, { message: 'success' });

  const withSuccessfullyUncompletedActiveTodo = () =>
    mockUncompleteOneActiveTodo(server, { message: 'success' });

  describe('imperative methods', () => {
    it('getAll.call', async () => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const allActiveTodos = await activeTodoService.getAll.call();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].id).toBe('1');
      expect(allActiveTodos[0].title).toBe('Active Todo 1');
      expect(allActiveTodos[0].createdAt.toISOString()).toBe(nowTimeStamp);
      expect(allActiveTodos[0].completedAt).toBeUndefined();
    });

    it('getOneById.call', async () => {
      withOneUncompletedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const activeTodo = await activeTodoService.getOneById.call({
        id: '1',
      });
      expect(activeTodo?.id).toBe('1');
      expect(activeTodo?.title).toBe('Active Todo 1');
    });

    it('createOne.call', async () => {
      const activeTodoService = getActiveTodoService();
      withNoActiveTodosInList();
      expect((await activeTodoService.getAll.call()).length).toBe(0);
      withSuccessfullyCreatedActiveTodo();
      const createActiveTodoResponse = await activeTodoService.createOne.call({
        title: 'Active Todo 1',
      });
      expect(createActiveTodoResponse.id).toBe('1');
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll.call()).length).toBe(1);
    });

    it('deleteOne.call', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll.call()).length).toBe(1);
      withSuccessfullyDeletedActiveTodo();
      withNoActiveTodosInList();
      await activeTodoService.deleteOne.call({ id: '1' });
      expect((await activeTodoService.getAll.call()).length).toBe(0);
    });

    it('completeOne.call', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll.call()).length).toBe(1);
      withSuccessfullyCompletedActiveTodo();
      withOneCompletedActiveTodoInList();
      await activeTodoService.completeOne.call({ id: '1' });
      expect((await activeTodoService.getAll.call()).length).toBe(1);
      expect(
        (await activeTodoService.getAll.call())[0].completedAt?.toISOString(),
      ).toBe(nowTimeStamp);
    });

    it('uncompleteOne.call', async () => {
      const activeTodoService = getActiveTodoService();
      withOneCompletedActiveTodoInList();
      expect((await activeTodoService.getAll.call()).length).toBe(1);
      withSuccessfullyUncompletedActiveTodo();
      await activeTodoService.uncompleteOne.call({ id: '1' });
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll.call()).length).toBe(1);
      expect(
        (await activeTodoService.getAll.call())[0].completedAt,
      ).toBeUndefined();
    });

    it('prioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll.call();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].id).toBe('1');
      expect(allActiveTodos[0].title).toBe('Active Todo 1');
      expect(allActiveTodos[0].createdAt.toISOString()).toBe(nowTimeStamp);
      expect(allActiveTodos[0].completedAt).toBeUndefined();
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll.call();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);
    });

    it('deprioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll.call();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll.call();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);

      activeTodoService.deprioritize({ id: '1' });
      const allActiveTodosAfterDeprioritization =
        await activeTodoService.getAll.call();
      expect(allActiveTodosAfterDeprioritization.length).toBe(1);
      expect(allActiveTodosAfterDeprioritization[0].isPrioritized).toBe(false);
    });
  });

  // hooks
  describe('hooks', () => {
    it('getAll.useQuery', async () => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const useQuery = renderHook(activeTodoService.getAll.useQuery, {
        wrapper: getTestWrapper(),
      });
      expect(useQuery.result.current.isPending).toBe(true);
      expect(useQuery.result.current.isSuccess).toBe(false);
      await waitFor(() =>
        expect(useQuery.result.current.isPending).toBe(false),
      );
      expect(useQuery.result.current.isSuccess).toBe(true);
      expect(useQuery.result.current.data?.length).toBe(1);
    });

    it('getOneById.useQuery', async () => {
      withOneUncompletedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const useQuery = renderHook(
        () => activeTodoService.getOneById.useQuery({ id: '1' }),
        {
          wrapper: getTestWrapper(),
        },
      );
      expect(useQuery.result.current.isPending).toBe(true);
      expect(useQuery.result.current.isSuccess).toBe(false);
      await waitFor(() =>
        expect(useQuery.result.current.isPending).toBe(false),
      );
      expect(useQuery.result.current.isSuccess).toBe(true);
      expect(useQuery.result.current.data?.id).toBe('1');
    });

    it('createOne.useMutation', async () => {
      withNoActiveTodosInList();
      withSuccessfullyCreatedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const useMutation = renderHook(activeTodoService.createOne.useMutation, {
        wrapper: getTestWrapper(),
      });
      const useQuery = renderHook(activeTodoService.getAll.useQuery, {
        wrapper: getTestWrapper(),
      });
      expect(useQuery.result.current.isPending).toBe(true);
      expect(useQuery.result.current.isSuccess).toBe(false);
      await waitFor(() =>
        expect(useQuery.result.current.isPending).toBe(false),
      );
      expect(useQuery.result.current.isSuccess).toBe(true);
      expect(useQuery.result.current.data?.length).toBe(0);

      withOneUncompletedActiveTodoInList();

      act(() => {
        useMutation.result.current.call({ title: 'Active Todo 1' });
      });

      expect(useMutation.result.current.isSuccess).toBe(false);

      await waitFor(() =>
        expect(useMutation.result.current.isSuccess).toBe(true),
      );

      expect(useQuery.result.current.data?.length).toBe(1);
      expect(useQuery.result.current.data?.[0].id).toBe('1');
    });

    it('deleteOne.useMutation', async () => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const useMutation = renderHook(activeTodoService.deleteOne.useMutation, {
        wrapper: getTestWrapper(),
      });
      const useQuery = renderHook(activeTodoService.getAll.useQuery, {
        wrapper: getTestWrapper(),
      });
      expect(useQuery.result.current.isPending).toBe(true);
      expect(useQuery.result.current.isSuccess).toBe(false);
      await waitFor(() =>
        expect(useQuery.result.current.isPending).toBe(false),
      );
      expect(useQuery.result.current.isSuccess).toBe(true);
      expect(useQuery.result.current.data?.length).toBe(1);

      withSuccessfullyDeletedActiveTodo();
      withNoActiveTodosInList();

      act(() => {
        useMutation.result.current.call({ id: '1' });
      });

      expect(useMutation.result.current.isSuccess).toBe(false);

      await waitFor(() =>
        expect(useMutation.result.current.isSuccess).toBe(true),
      );

      expect(useQuery.result.current.data?.length).toBe(0);
    });

    it('completeOne.useMutation', async () => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const useMutation = renderHook(
        activeTodoService.completeOne.useMutation,
        {
          wrapper: getTestWrapper(),
        },
      );
      const useQuery = renderHook(activeTodoService.getAll.useQuery, {
        wrapper: getTestWrapper(),
      });
      expect(useQuery.result.current.isPending).toBe(true);
      expect(useQuery.result.current.isSuccess).toBe(false);

      await waitFor(() =>
        expect(useQuery.result.current.isPending).toBe(false),
      );
      expect(useQuery.result.current.isSuccess).toBe(true);
      expect(useQuery.result.current.data?.length).toBe(1);

      withSuccessfullyCompletedActiveTodo();
      withOneCompletedActiveTodoInList();

      act(() => {
        useMutation.result.current.call({ id: '1' });
      });

      expect(useMutation.result.current.isSuccess).toBe(false);

      await waitFor(() =>
        expect(useMutation.result.current.isSuccess).toBe(true),
      );

      expect(useQuery.result.current.data?.[0].completedAt?.toISOString()).toBe(
        nowTimeStamp,
      );
    });

    it('uncompleteOne.useMutation', async () => {
      withOneCompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const useMutation = renderHook(
        activeTodoService.uncompleteOne.useMutation,
        {
          wrapper: getTestWrapper(),
        },
      );
      const useQuery = renderHook(activeTodoService.getAll.useQuery, {
        wrapper: getTestWrapper(),
      });
      expect(useQuery.result.current.isPending).toBe(true);
      expect(useQuery.result.current.isSuccess).toBe(false);

      await waitFor(() =>
        expect(useQuery.result.current.isPending).toBe(false),
      );
      expect(useQuery.result.current.isSuccess).toBe(true);
      expect(useQuery.result.current.data?.length).toBe(1);

      withSuccessfullyUncompletedActiveTodo();
      withOneUncompletedActiveTodoInList();

      act(() => {
        useMutation.result.current.call({ id: '1' });
      });

      expect(useMutation.result.current.isSuccess).toBe(false);

      await waitFor(() =>
        expect(useMutation.result.current.isSuccess).toBe(true),
      );

      expect(useQuery.result.current.data?.[0].completedAt).toBeUndefined();
    });
  });

  describe('using chimeric test harnesses', () => {
    it.each(ChimericQueryMethods)('getAll.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const harness = getChimericQueryTestHarness(getTestWrapper())(
        activeTodoService.getAll,
        chimericMethod,
      );
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isSuccess).toBe(false);
      await harness.waitForSuccess(() =>
        expect(harness.result.current.isPending).toBe(false),
      );
      expect(harness.result.current.data?.length).toBe(1);
      expect(harness.result.current.data?.[0].id).toBe('1');
      expect(harness.result.current.data?.[0].title).toBe('Active Todo 1');
      expect(harness.result.current.data?.[0].createdAt.toISOString()).toBe(
        nowTimeStamp,
      );
      expect(harness.result.current.data?.[0].completedAt).toBeUndefined();
    });

    it.each(ChimericQueryMethods)('getOneById.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const harness = getChimericQueryTestHarness(getTestWrapper())(
        activeTodoService.getOneById,
        chimericMethod,
        { id: '1' },
      );
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isSuccess).toBe(false);
      await harness.waitForSuccess(() =>
        expect(harness.result.current.isPending).toBe(false),
      );
      expect(harness.result.current.data?.id).toBe('1');
    });

    it.each(ChimericMutationMethods)('createOne.%s', async (chimericMethod) => {
      withNoActiveTodosInList();
      withSuccessfullyCreatedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const testWrapper = getTestWrapper();
      const createOneHarness = getChimericMutationTestHarness(testWrapper)(
        activeTodoService.createOne,
        chimericMethod,
      );
      const getAllHarness = getChimericQueryTestHarness(testWrapper)(
        activeTodoService.getAll,
        inferQueryMethod(chimericMethod),
      );
      await getAllHarness.waitForSuccess(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(0);
      withOneUncompletedActiveTodoInList();
      act(() => {
        createOneHarness.call({ title: 'Active Todo 1' });
      });
      await createOneHarness.waitForSuccess(() =>
        expect(createOneHarness.result.current.isPending).toBe(false),
      );
      await getAllHarness.waitForSuccess(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(1);
      expect(getAllHarness.result.current.data?.[0].id).toBe('1');
      expect(getAllHarness.result.current.data?.[0].title).toBe(
        'Active Todo 1',
      );
      expect(
        getAllHarness.result.current.data?.[0].createdAt.toISOString(),
      ).toBe(nowTimeStamp);
    });

    it.each(ChimericMutationMethods)('deleteOne.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const deleteOneHarness = getChimericMutationTestHarness(getTestWrapper())(
        activeTodoService.deleteOne,
        chimericMethod,
      );
      const getAllHarness = getChimericQueryTestHarness(getTestWrapper())(
        activeTodoService.getAll,
        inferQueryMethod(chimericMethod),
      );
      await getAllHarness.waitForSuccess(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(1);
      withSuccessfullyDeletedActiveTodo();
      withNoActiveTodosInList();
      act(() => {
        deleteOneHarness.call({ id: '1' });
      });
      await deleteOneHarness.waitForSuccess(() =>
        expect(deleteOneHarness.result.current.isPending).toBe(false),
      );
      await getAllHarness.waitForSuccess(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(0);
    });

    it.each(ChimericMutationMethods)(
      'completeOne.%s',
      async (chimericMethod) => {
        withOneUncompletedActiveTodoInList();
        const activeTodoService = getActiveTodoService();
        const completeOneHarness = getChimericMutationTestHarness(
          getTestWrapper(),
        )(activeTodoService.completeOne, chimericMethod);
        const getAllHarness = getChimericQueryTestHarness(getTestWrapper())(
          activeTodoService.getAll,
          inferQueryMethod(chimericMethod),
        );
        await getAllHarness.waitForSuccess(() =>
          expect(getAllHarness.result.current.isPending).toBe(false),
        );
        expect(getAllHarness.result.current.data?.length).toBe(1);
        withSuccessfullyCompletedActiveTodo();
        withOneCompletedActiveTodoInList();
        act(() => {
          completeOneHarness.call({ id: '1' });
        });
        await completeOneHarness.waitForSuccess(() =>
          expect(completeOneHarness.result.current.isPending).toBe(false),
        );
        await getAllHarness.waitForSuccess(() =>
          expect(getAllHarness.result.current.isPending).toBe(false),
        );
        expect(
          getAllHarness.result.current.data?.[0].completedAt?.toISOString(),
        ).toBe(nowTimeStamp);
      },
    );

    it.each(ChimericMutationMethods)(
      'uncompleteOne.%s',
      async (chimericMethod) => {
        withOneCompletedActiveTodoInList();
        const activeTodoService = getActiveTodoService();
        const uncompleteOneHarness = getChimericMutationTestHarness(
          getTestWrapper(),
        )(activeTodoService.uncompleteOne, chimericMethod);
        const getAllHarness = getChimericQueryTestHarness(getTestWrapper())(
          activeTodoService.getAll,
          inferQueryMethod(chimericMethod),
        );
        await getAllHarness.waitForSuccess(() =>
          expect(getAllHarness.result.current.isPending).toBe(false),
        );
        expect(getAllHarness.result.current.data?.length).toBe(1);
        withSuccessfullyUncompletedActiveTodo();
        withOneUncompletedActiveTodoInList();
        act(() => {
          uncompleteOneHarness.call({ id: '1' });
        });
        await uncompleteOneHarness.waitForSuccess(() =>
          expect(uncompleteOneHarness.result.current.isPending).toBe(false),
        );
        await getAllHarness.waitForSuccess(() =>
          expect(getAllHarness.result.current.isPending).toBe(false),
        );
        expect(
          getAllHarness.result.current.data?.[0].completedAt,
        ).toBeUndefined();
      },
    );

    it('prioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll.call();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].id).toBe('1');
      expect(allActiveTodos[0].title).toBe('Active Todo 1');
      expect(allActiveTodos[0].createdAt.toISOString()).toBe(nowTimeStamp);
      expect(allActiveTodos[0].completedAt).toBeUndefined();
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll.call();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);
    });

    it('deprioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll.call();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll.call();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);

      activeTodoService.deprioritize({ id: '1' });
      const allActiveTodosAfterDeprioritization =
        await activeTodoService.getAll.call();
      expect(allActiveTodosAfterDeprioritization.length).toBe(1);
      expect(allActiveTodosAfterDeprioritization[0].isPrioritized).toBe(false);
    });
  });
});
