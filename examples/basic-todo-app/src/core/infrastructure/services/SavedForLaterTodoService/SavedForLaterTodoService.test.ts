import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { act } from 'react';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import {
  chimericMethods,
  ChimericQueryTestHarness,
  ChimericMutationTestHarness,
} from '@chimeric/testing-react-query';
import { mockGetAllSavedForLaterTodos } from 'src/__test__/network/savedForLaterTodo/mockGetAllSavedForLaterTodos';
import { mockGetOneSavedForLaterTodo } from 'src/__test__/network/savedForLaterTodo/mockGetOneSavedForLaterTodo';
import { mockActivateSavedForLaterTodo } from 'src/__test__/network/savedForLaterTodo/mockActivateSavedForLaterTodo';
import { mockDeleteSavedForLaterTodo } from 'src/__test__/network/savedForLaterTodo/mockDeleteSavedForLaterTodo';
import { mockSaveActiveTodoForLater } from 'src/__test__/network/savedForLaterTodo/mockSaveActiveTodoForLater';
import { savedForLaterTodoService } from '.';

describe('SavedForLaterTodoService', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

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

  it.each(chimericMethods)('getAll.%s', async (method) => {
    withOneSavedForLaterTodoInList();
    const harness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      method,
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

  it.each(chimericMethods)('getOneById.%s', async (method) => {
    withOneSavedForLaterTodo();
    const harness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getOneById,
      method,
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

  it.each(chimericMethods)('activate.%s', async (method) => {
    withOneSavedForLaterTodoInList();
    withSuccessfullyActivatedSavedForLaterTodo();
    const testWrapper = getTestWrapper();
    const activateOneHarness = ChimericMutationTestHarness({
      chimericMutation: savedForLaterTodoService.activate,
      method,
      wrapper: testWrapper,
    });
    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      method,
      wrapper: testWrapper,
    });
    await getAllHarness.waitFor(() =>
      expect(getAllHarness.result.current.isPending).toBe(false),
    );
    expect(getAllHarness.result.current.data?.length).toBe(1);
    withNoSavedForLaterTodosInList();
    act(() => {
      activateOneHarness.result.current.invoke({ savedForLaterTodoId: '1' });
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

  it.each(chimericMethods)('deleteOne.%s', async (method) => {
    withOneSavedForLaterTodoInList();
    const testWrapper = getTestWrapper();
    const deleteOneHarness = ChimericMutationTestHarness({
      chimericMutation: savedForLaterTodoService.deleteOne,
      method,
      wrapper: testWrapper,
    });
    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      method,
      wrapper: testWrapper,
    });
    withSuccessfullyDeletedSavedForLaterTodo();
    withNoSavedForLaterTodosInList();
    act(() => {
      deleteOneHarness.result.current.invoke({ id: '1' });
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

  it.each(chimericMethods)('saveForLater.%s', async (method) => {
    withNoSavedForLaterTodosInList();
    const testWrapper = getTestWrapper();
    const saveForLaterHarness = ChimericMutationTestHarness({
      chimericMutation: savedForLaterTodoService.saveForLater,
      method,
      wrapper: testWrapper,
    });
    const getAllHarness = ChimericQueryTestHarness({
      chimericQuery: savedForLaterTodoService.getAll,
      method,
      wrapper: testWrapper,
    });
    await getAllHarness.waitFor(() =>
      expect(getAllHarness.result.current.isPending).toBe(false),
    );
    expect(getAllHarness.result.current.data?.length).toBe(0);

    withSuccessfullySavedForLaterTodo();
    withOneSavedForLaterTodoInList();
    act(() => {
      saveForLaterHarness.result.current.invoke({ activeTodoId: '1' });
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
