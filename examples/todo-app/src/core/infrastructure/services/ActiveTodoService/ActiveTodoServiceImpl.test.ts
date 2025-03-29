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
  ChimericQueryTestHarness,
  ChimericMutationTestHarness,
  chimericMethods,
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

  describe('idiomatic methods', () => {
    it('getAll', async () => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const allActiveTodos = await activeTodoService.getAll();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].id).toBe('1');
      expect(allActiveTodos[0].title).toBe('Active Todo 1');
      expect(allActiveTodos[0].createdAt.toISOString()).toBe(nowTimeStamp);
      expect(allActiveTodos[0].completedAt).toBeUndefined();
    });

    it('getOneById', async () => {
      withOneUncompletedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const activeTodo = await activeTodoService.getOneById({
        id: '1',
      });
      expect(activeTodo?.id).toBe('1');
      expect(activeTodo?.title).toBe('Active Todo 1');
    });

    it('createOne', async () => {
      const activeTodoService = getActiveTodoService();
      withNoActiveTodosInList();
      expect((await activeTodoService.getAll()).length).toBe(0);
      withSuccessfullyCreatedActiveTodo();
      const createActiveTodoResponse = await activeTodoService.createOne({
        title: 'Active Todo 1',
      });
      expect(createActiveTodoResponse.id).toBe('1');
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll()).length).toBe(1);
    });

    it('deleteOne', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll()).length).toBe(1);
      withSuccessfullyDeletedActiveTodo();
      withNoActiveTodosInList();
      await activeTodoService.deleteOne({ id: '1' });
      expect((await activeTodoService.getAll()).length).toBe(0);
    });

    it('completeOne', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll()).length).toBe(1);
      withSuccessfullyCompletedActiveTodo();
      withOneCompletedActiveTodoInList();
      await activeTodoService.completeOne({ id: '1' });
      expect((await activeTodoService.getAll()).length).toBe(1);
      expect(
        (await activeTodoService.getAll())[0].completedAt?.toISOString(),
      ).toBe(nowTimeStamp);
    });

    it('uncompleteOne', async () => {
      const activeTodoService = getActiveTodoService();
      withOneCompletedActiveTodoInList();
      expect((await activeTodoService.getAll()).length).toBe(1);
      withSuccessfullyUncompletedActiveTodo();
      await activeTodoService.uncompleteOne({ id: '1' });
      withOneUncompletedActiveTodoInList();
      expect((await activeTodoService.getAll()).length).toBe(1);
      expect((await activeTodoService.getAll())[0].completedAt).toBeUndefined();
    });

    it('prioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].id).toBe('1');
      expect(allActiveTodos[0].title).toBe('Active Todo 1');
      expect(allActiveTodos[0].createdAt.toISOString()).toBe(nowTimeStamp);
      expect(allActiveTodos[0].completedAt).toBeUndefined();
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);
    });

    it('deprioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);

      activeTodoService.deprioritize({ id: '1' });
      const allActiveTodosAfterDeprioritization =
        await activeTodoService.getAll();
      expect(allActiveTodosAfterDeprioritization.length).toBe(1);
      expect(allActiveTodosAfterDeprioritization[0].isPrioritized).toBe(false);
    });
  });

  // hooks
  describe('reactive hooks', () => {
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
    it.each(chimericMethods)('getAll.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const harness = ChimericQueryTestHarness({
        chimericQuery: activeTodoService.getAll,
        chimericMethod,
        wrapper: getTestWrapper(),
      });
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isSuccess).toBe(false);
      await harness.waitFor(() =>
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

    it.each(chimericMethods)('getOneById.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const harness = ChimericQueryTestHarness({
        chimericQuery: activeTodoService.getOneById,
        chimericMethod,
        params: { id: '1' },
        wrapper: getTestWrapper(),
      });
      expect(harness.result.current.isPending).toBe(true);
      expect(harness.result.current.isSuccess).toBe(false);
      await harness.waitFor(() =>
        expect(harness.result.current.isPending).toBe(false),
      );
      expect(harness.result.current.data?.id).toBe('1');
    });

    it.each(chimericMethods)('createOne.%s', async (chimericMethod) => {
      withNoActiveTodosInList();
      withSuccessfullyCreatedActiveTodo();
      const activeTodoService = getActiveTodoService();
      const testWrapper = getTestWrapper();
      const createOneHarness = ChimericMutationTestHarness({
        chimericMutation: activeTodoService.createOne,
        chimericMethod,
        wrapper: testWrapper,
      });
      const getAllHarness = ChimericQueryTestHarness({
        chimericQuery: activeTodoService.getAll,
        chimericMethod,
        wrapper: testWrapper,
      });
      await getAllHarness.waitFor(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(0);
      withOneUncompletedActiveTodoInList();
      act(() => {
        createOneHarness.result.current.call({ title: 'Active Todo 1' });
      });
      await createOneHarness.waitFor(() =>
        expect(createOneHarness.result.current.isPending).toBe(false),
      );
      await getAllHarness.waitFor(
        () => expect(getAllHarness.result.current.isPending).toBe(false),
        { reinvokeIdiomaticFn: true },
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

    it.each(chimericMethods)('deleteOne.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodoInList();
      const testWrapper = getTestWrapper();
      const activeTodoService = getActiveTodoService();
      const deleteOneHarness = ChimericMutationTestHarness({
        chimericMutation: activeTodoService.deleteOne,
        chimericMethod,
        wrapper: testWrapper,
      });
      const getAllHarness = ChimericQueryTestHarness({
        chimericQuery: activeTodoService.getAll,
        chimericMethod,
        wrapper: testWrapper,
      });
      await getAllHarness.waitFor(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(1);
      withSuccessfullyDeletedActiveTodo();
      withNoActiveTodosInList();
      act(() => {
        deleteOneHarness.result.current.call({ id: '1' });
      });
      await deleteOneHarness.waitFor(() =>
        expect(deleteOneHarness.result.current.isPending).toBe(false),
      );
      await getAllHarness.waitFor(
        () => expect(getAllHarness.result.current.isPending).toBe(false),
        { reinvokeIdiomaticFn: true },
      );
      expect(getAllHarness.result.current.data?.length).toBe(0);
    });

    it.each(chimericMethods)('completeOne.%s', async (chimericMethod) => {
      withOneUncompletedActiveTodoInList();
      const testWrapper = getTestWrapper();
      const activeTodoService = getActiveTodoService();
      const completeOneHarness = ChimericMutationTestHarness({
        chimericMutation: activeTodoService.completeOne,
        chimericMethod,
        wrapper: testWrapper,
      });
      const getAllHarness = ChimericQueryTestHarness({
        chimericQuery: activeTodoService.getAll,
        chimericMethod,
        wrapper: testWrapper,
      });
      await getAllHarness.waitFor(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(1);
      withSuccessfullyCompletedActiveTodo();
      withOneCompletedActiveTodoInList();
      act(() => {
        completeOneHarness.result.current.call({ id: '1' });
      });
      await completeOneHarness.waitFor(() =>
        expect(completeOneHarness.result.current.isPending).toBe(false),
      );
      await getAllHarness.waitFor(
        () => expect(getAllHarness.result.current.isPending).toBe(false),
        { reinvokeIdiomaticFn: true },
      );
      expect(
        getAllHarness.result.current.data?.[0].completedAt?.toISOString(),
      ).toBe(nowTimeStamp);
    });

    it.each(chimericMethods)('uncompleteOne.%s', async (chimericMethod) => {
      withOneCompletedActiveTodoInList();
      const activeTodoService = getActiveTodoService();
      const testWrapper = getTestWrapper();
      const uncompleteOneHarness = ChimericMutationTestHarness({
        chimericMutation: activeTodoService.uncompleteOne,
        chimericMethod,
        wrapper: testWrapper,
      });
      const getAllHarness = ChimericQueryTestHarness({
        chimericQuery: activeTodoService.getAll,
        chimericMethod,
        wrapper: testWrapper,
      });
      await getAllHarness.waitFor(() =>
        expect(getAllHarness.result.current.isPending).toBe(false),
      );
      expect(getAllHarness.result.current.data?.length).toBe(1);
      withSuccessfullyUncompletedActiveTodo();
      withOneUncompletedActiveTodoInList();
      act(() => {
        uncompleteOneHarness.result.current.call({ id: '1' });
      });
      await uncompleteOneHarness.waitFor(() =>
        expect(uncompleteOneHarness.result.current.isPending).toBe(false),
      );
      await getAllHarness.waitFor(
        () => expect(getAllHarness.result.current.isPending).toBe(false),
        { reinvokeIdiomaticFn: true },
      );
      expect(
        getAllHarness.result.current.data?.[0].completedAt,
      ).toBeUndefined();
    });

    it('prioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].id).toBe('1');
      expect(allActiveTodos[0].title).toBe('Active Todo 1');
      expect(allActiveTodos[0].createdAt.toISOString()).toBe(nowTimeStamp);
      expect(allActiveTodos[0].completedAt).toBeUndefined();
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);
    });

    it('deprioritize', async () => {
      const activeTodoService = getActiveTodoService();
      withOneUncompletedActiveTodoInList();
      const allActiveTodos = await activeTodoService.getAll();
      expect(allActiveTodos.length).toBe(1);
      expect(allActiveTodos[0].isPrioritized).toBe(false);

      activeTodoService.prioritize({ id: '1' });
      const allActiveTodosAfterPrioritization =
        await activeTodoService.getAll();
      expect(allActiveTodosAfterPrioritization.length).toBe(1);
      expect(allActiveTodosAfterPrioritization[0].isPrioritized).toBe(true);

      activeTodoService.deprioritize({ id: '1' });
      const allActiveTodosAfterDeprioritization =
        await activeTodoService.getAll();
      expect(allActiveTodosAfterDeprioritization.length).toBe(1);
      expect(allActiveTodosAfterDeprioritization[0].isPrioritized).toBe(false);
    });
  });
});
