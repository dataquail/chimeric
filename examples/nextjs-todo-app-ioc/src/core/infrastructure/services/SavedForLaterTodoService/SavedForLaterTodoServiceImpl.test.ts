import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { getContainer } from '@/core/global/container';
import { mockGetAllSavedForLaterTodos } from '@/__test__/network/savedForLaterTodo/mockGetAllSavedForLaterTodos';
import { mockGetOneSavedForLaterTodo } from '@/__test__/network/savedForLaterTodo/mockGetOneSavedForLaterTodo';
import { mockActivateSavedForLaterTodo } from '@/__test__/network/savedForLaterTodo/mockActivateSavedForLaterTodo';
import { mockDeleteSavedForLaterTodo } from '@/__test__/network/savedForLaterTodo/mockDeleteSavedForLaterTodo';
import { mockSaveActiveTodoForLater } from '@/__test__/network/savedForLaterTodo/mockSaveActiveTodoForLater';

describe('SavedForLaterTodoServiceImpl', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const getSavedForLaterTodoService = () => {
    return getContainer().savedForLaterTodoService;
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

  it('getAll', async () => {
    withOneSavedForLaterTodoInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const all = await savedForLaterTodoService.getAll();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('1');
    expect(all[0].title).toBe('Saved For Later Todo 1');
    expect(all[0].createdAt.toISOString()).toBe(nowTimeStamp);
  });

  it('getOneById', async () => {
    withOneSavedForLaterTodo();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    const todo = await savedForLaterTodoService.getOneById('1');
    expect(todo?.id).toBe('1');
  });

  it('activate', async () => {
    withOneSavedForLaterTodoInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    expect((await savedForLaterTodoService.getAll()).length).toBe(1);
    withSuccessfullyActivatedSavedForLaterTodo();
    await savedForLaterTodoService.activate({ savedForLaterTodoId: '1' });
    withNoSavedForLaterTodosInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(0);
  });

  it('deleteOne', async () => {
    withOneSavedForLaterTodoInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    expect((await savedForLaterTodoService.getAll()).length).toBe(1);
    withSuccessfullyDeletedSavedForLaterTodo();
    withNoSavedForLaterTodosInList();
    await savedForLaterTodoService.deleteOne({ id: '1' });
    expect((await savedForLaterTodoService.getAll()).length).toBe(0);
  });

  it('saveForLater', async () => {
    withNoSavedForLaterTodosInList();
    const savedForLaterTodoService = getSavedForLaterTodoService();
    expect((await savedForLaterTodoService.getAll()).length).toBe(0);
    withSuccessfullySavedForLaterTodo();
    await savedForLaterTodoService.saveForLater({ activeTodoId: '1' });
    withOneSavedForLaterTodoInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(1);
  });
});
