import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { act } from 'react';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import {
  chimericMethods,
  ChimericQueryTestHarness,
  ChimericMutationTestHarness,
} from '@chimeric/testing';
import { mockGetAllSavedForLaterTodos } from 'src/__test__/network/savedForLaterTodo/mockGetAllSavedForLaterTodos';
import { mockGetOneSavedForLaterTodo } from 'src/__test__/network/savedForLaterTodo/mockGetOneSavedForLaterTodo';
import { mockActivateSavedForLaterTodo } from 'src/__test__/network/savedForLaterTodo/mockActivateSavedForLaterTodo';
import { mockDeleteSavedForLaterTodo } from 'src/__test__/network/savedForLaterTodo/mockDeleteSavedForLaterTodo';
import { mockSaveActiveTodoForLater } from 'src/__test__/network/savedForLaterTodo/mockSaveActiveTodoForLater';

describe('SavedForLaterTodoServiceImpl', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const getSavedForLaterTodoService = () => {
    return appContainer.get<InjectionType<'ISavedForLaterTodoService'>>(
      InjectionSymbol('ISavedForLaterTodoService'),
    );
  };

  const withOneSavedForLaterTodoInList = () => {
    mockGetAllSavedForLaterTodos(server, {
      total_count: 1,
      list: [
        {
          id: '1',
          title: 'Saved For Later Todo 1',
          created_at: nowTimeStamp,
        },
      ],
    });
  };

  const withNoSavedForLaterTodosInList = () => {
    mockGetAllSavedForLaterTodos(server, {
      total_count: 0,
      list: [],
    });
  };

  const withOneSavedForLaterTodo = () => {
    mockGetOneSavedForLaterTodo(server, {
      id: '1',
      title: 'Saved For Later Todo 1',
      created_at: nowTimeStamp,
    });
  };

  const withSuccessfullyActivatedSavedForLaterTodo = () => {
    mockActivateSavedForLaterTodo(server, {
      id: '1',
    });
  };

  const withSuccessfullyDeletedSavedForLaterTodo = () => {
    mockDeleteSavedForLaterTodo(server, {
      message: 'success',
    });
  };

  const withSuccessfullySavedForLaterTodo = () => {
    mockSaveActiveTodoForLater(server, {
      id: '1',
    });
  };

  it.each(chimericMethods)('getAll.%s', async (chimericMethod) => {
    withOneSavedForLaterTodoInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const harness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
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
    expect(harness.result.current.data?.[0].title).toBe(
      'Saved For Later Todo 1',
    );
    expect(harness.result?.current.data?.[0].createdAt.toISOString()).toBe(
      nowTimeStamp,
    );
  });

  it.each(chimericMethods)('getOneById.%s', async (chimericMethod) => {
    withOneSavedForLaterTodo();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const harness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getOneById,
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

  it.each(chimericMethods)('activate.%s', async (chimericMethod) => {
    withOneSavedForLaterTodoInList();
    withSuccessfullyActivatedSavedForLaterTodo();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const testWrapper = getTestWrapper();
    const activateOneHarness = ChimericMutationTestHarness({
      chimericMutation: savedForLaterTodoService.activate,
      chimericMethod,
      wrapper: testWrapper,
    });
    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      chimericMethod,
      wrapper: testWrapper,
    });
    await getAllHarness.waitFor(() =>
      expect(getAllHarness.result.current.isPending).toBe(false),
    );
    expect(getAllHarness.result.current.data?.length).toBe(1);
    withNoSavedForLaterTodosInList();
    act(() => {
      activateOneHarness.result.current.call({ savedForLaterTodoId: '1' });
    });
    await activateOneHarness.waitFor(() =>
      expect(activateOneHarness.result.current.isPending).toBe(false),
    );
    await getAllHarness.waitFor(
      () => expect(getAllHarness.result.current.isPending).toBe(false),
      { reinvokeIdiomaticFn: true },
    );
    expect(getAllHarness.result.current.data?.length).toBe(0);
  });

  it.each(chimericMethods)('deleteOne.%s', async (chimericMethod) => {
    withOneSavedForLaterTodoInList();
    const testWrapper = getTestWrapper();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const deleteOneHarness = ChimericMutationTestHarness({
      chimericMutation: savedForLaterTodoService.deleteOne,
      chimericMethod,
      wrapper: testWrapper,
    });
    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      chimericMethod,
      wrapper: testWrapper,
    });
    withSuccessfullyDeletedSavedForLaterTodo();
    withNoSavedForLaterTodosInList();
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

  it.each(chimericMethods)('saveForLater.%s', async (chimericMethod) => {
    withNoSavedForLaterTodosInList();
    const testWrapper = getTestWrapper();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const saveForLaterHarness = ChimericMutationTestHarness({
      chimericMutation: savedForLaterTodoService.saveForLater,
      chimericMethod,
      wrapper: testWrapper,
    });
    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      chimericMethod,
      wrapper: testWrapper,
    });
    await getAllHarness.waitFor(() =>
      expect(getAllHarness.result.current.isPending).toBe(false),
    );
    expect(getAllHarness.result.current.data?.length).toBe(0);

    withSuccessfullySavedForLaterTodo();
    withOneSavedForLaterTodoInList();
    act(() => {
      saveForLaterHarness.result.current.call({ activeTodoId: '1' });
    });
    await saveForLaterHarness.waitFor(() =>
      expect(saveForLaterHarness.result.current.isPending).toBe(false),
    );
    await getAllHarness.waitFor(
      () => expect(getAllHarness.result.current.isPending).toBe(false),
      { reinvokeIdiomaticFn: true },
    );
    expect(getAllHarness.result.current.data?.length).toBe(1);
  });
});
