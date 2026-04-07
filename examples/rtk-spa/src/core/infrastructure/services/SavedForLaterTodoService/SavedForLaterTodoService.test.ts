import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
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

  it('getAll', async () => {
    withOneSavedForLaterTodoInList();
    const all = await savedForLaterTodoService.getAll();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('1');
    expect(all[0].title).toBe('Saved For Later Todo 1');
    expect(all[0].createdAt.toISOString()).toBe(nowTimeStamp);
  });

  it('getOneById', async () => {
    withOneSavedForLaterTodo();
    const todo = await savedForLaterTodoService.getOneById({ id: '1' });
    expect(todo?.id).toBe('1');
  });

  it('activate', async () => {
    withOneSavedForLaterTodoInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(1);
    withSuccessfullyActivatedSavedForLaterTodo();
    await savedForLaterTodoService.activate({ savedForLaterTodoId: '1' });
    withNoSavedForLaterTodosInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(0);
  });

  it('deleteOne', async () => {
    withOneSavedForLaterTodoInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(1);
    withSuccessfullyDeletedSavedForLaterTodo();
    withNoSavedForLaterTodosInList();
    await savedForLaterTodoService.deleteOne({ id: '1' });
    expect((await savedForLaterTodoService.getAll()).length).toBe(0);
  });

  it('saveForLater', async () => {
    withNoSavedForLaterTodosInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(0);
    withSuccessfullySavedForLaterTodo();
    await savedForLaterTodoService.saveForLater({ activeTodoId: '1' });
    withOneSavedForLaterTodoInList();
    expect((await savedForLaterTodoService.getAll()).length).toBe(1);
  });
});
