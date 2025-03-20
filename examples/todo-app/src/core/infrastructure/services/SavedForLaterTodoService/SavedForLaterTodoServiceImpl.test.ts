import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { act } from '@testing-library/react';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { appContainer } from 'src/core/global/appContainer';
import { getTestWrapper } from 'src/__test__/getTestWrapper';
import {
  ChimericQueryMethods,
  getChimericQueryTestHarness,
  inferQueryMethod,
} from 'src/utils/domain/__tests__/getChimericQueryTestHarness';
import {
  ChimericMutationMethods,
  getChimericMutationTestHarness,
} from 'src/utils/domain/__tests__/getChimericMutationTestHarness';
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

  it.each(ChimericQueryMethods)('getAll.%s', async (chimericMethod) => {
    withOneSavedForLaterTodoInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const harness = getChimericQueryTestHarness(getTestWrapper())(
      savedForLaterTodoService.getAll,
      chimericMethod,
    );
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);
    await harness.waitForSuccess();
    expect(harness.result.current.data?.length).toBe(1);
    expect(harness.result.current.data?.[0].id).toBe('1');
    expect(harness.result.current.data?.[0].title).toBe(
      'Saved For Later Todo 1',
    );
    expect(harness.result?.current.data?.[0].createdAt.toISOString()).toBe(
      nowTimeStamp,
    );
  });

  it.each(ChimericQueryMethods)('getOneById.%s', async (chimericMethod) => {
    withOneSavedForLaterTodo();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const harness = getChimericQueryTestHarness(getTestWrapper())(
      savedForLaterTodoService.getOneById,
      chimericMethod,
      { id: '1' },
    );
    expect(harness.result.current.isPending).toBe(true);
    expect(harness.result.current.isSuccess).toBe(false);
    await harness.waitForSuccess();
    expect(harness.result.current.data?.id).toBe('1');
  });

  it.each(ChimericMutationMethods)('activate.%s', async (chimericMethod) => {
    withOneSavedForLaterTodoInList();
    withSuccessfullyActivatedSavedForLaterTodo();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const testWrapper = getTestWrapper();
    const activateOneHarness = getChimericMutationTestHarness(testWrapper)(
      savedForLaterTodoService.activate,
      chimericMethod,
    );
    const getAllHarness = getChimericQueryTestHarness(testWrapper)(
      savedForLaterTodoService.getAll,
      inferQueryMethod(chimericMethod),
    );
    await getAllHarness.waitForSuccess();
    expect(getAllHarness.result.current.data?.length).toBe(1);
    withNoSavedForLaterTodosInList();
    act(() => {
      activateOneHarness.call({ savedForLaterTodoId: '1' });
    });
    await activateOneHarness.waitForSuccess();
    await getAllHarness.waitForSuccess();
    expect(getAllHarness.result.current.data?.length).toBe(0);
  });

  it.each(ChimericMutationMethods)('deleteOne.%s', async (chimericMethod) => {
    withOneSavedForLaterTodoInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const deleteOneHarness = getChimericMutationTestHarness(getTestWrapper())(
      savedForLaterTodoService.deleteOne,
      chimericMethod,
    );
    const getAllHarness = getChimericQueryTestHarness(getTestWrapper())(
      savedForLaterTodoService.getAll,
      inferQueryMethod(chimericMethod),
    );
    withSuccessfullyDeletedSavedForLaterTodo();
    withNoSavedForLaterTodosInList();
    act(() => {
      deleteOneHarness.call({ id: '1' });
    });
    await deleteOneHarness.waitForSuccess();
    await getAllHarness.waitForSuccess();
    expect(getAllHarness.result.current.data?.length).toBe(0);
  });

  it.each(ChimericMutationMethods)(
    'saveForLater.%s',
    async (chimericMethod) => {
      withNoSavedForLaterTodosInList();
      const savedForLaterTodoService = getSavedForLaterTodoService();
      const saveForLaterHarness = getChimericMutationTestHarness(
        getTestWrapper(),
      )(savedForLaterTodoService.saveForLater, chimericMethod);
      const getAllHarness = getChimericQueryTestHarness(getTestWrapper())(
        savedForLaterTodoService.getAll,
        inferQueryMethod(chimericMethod),
      );
      await getAllHarness.waitForSuccess();
      expect(getAllHarness.result.current.data?.length).toBe(0);

      withSuccessfullySavedForLaterTodo();
      withOneSavedForLaterTodoInList();
      act(() => {
        saveForLaterHarness.call({ activeTodoId: '1' });
      });
      await saveForLaterHarness.waitForSuccess();
      await getAllHarness.waitForSuccess();
      expect(getAllHarness.result.current.data?.length).toBe(1);
    },
  );
});
