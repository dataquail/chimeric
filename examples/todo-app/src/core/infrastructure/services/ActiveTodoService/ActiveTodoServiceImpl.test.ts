import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { container } from 'src/core/global/container';
import { mockGetAllActiveTodos } from 'src/__test__/network/activeTodo/mockGetAllActiveTodos';
import { mockCreateOneActiveTodo } from 'src/__test__/network/activeTodo/mockCreateOneActiveTodo';
import { mockDeleteOneActiveTodo } from 'src/__test__/network/activeTodo/mockDeleteOneActiveTodo';
import { mockCompleteOneActiveTodo } from 'src/__test__/network/activeTodo/mockCompleteOneActiveTodo';
import { mockUncompleteOneActiveTodo } from 'src/__test__/network/activeTodo/mockUncompleteOneActiveTodo';
import { mockGetOneActiveTodo } from 'src/__test__/network/activeTodo/mockGetOneActiveTodo';
import { usePriorityTodoStore } from 'src/core/infrastructure/repositories/PriorityTodoRepository/priorityTodoStore';

describe('ActiveTodoServiceImpl', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    usePriorityTodoStore.setState({ dict: {} });
  });
  afterAll(() => server.close());

  const nowTimeStamp = new Date().toISOString();

  const getActiveTodoService = () => container.activeTodoService;

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
    withOneUncompletedActiveTodoInList();
    const activeTodoService = getActiveTodoService();
    await activeTodoService.getAll();

    const priorityTodo = container.priorityTodoRepository.getOneById({
      id: '1',
    });
    expect(priorityTodo?.isPrioritized).toBe(false);

    container.prioritizeTodoUseCase({ id: '1' });
    const priorityTodoAfter = container.priorityTodoRepository.getOneById({
      id: '1',
    });
    expect(priorityTodoAfter?.isPrioritized).toBe(true);
  });

  it('deprioritize', async () => {
    withOneUncompletedActiveTodoInList();
    const activeTodoService = getActiveTodoService();
    await activeTodoService.getAll();

    expect(
      container.priorityTodoRepository.getOneById({ id: '1' })?.isPrioritized,
    ).toBe(false);

    container.prioritizeTodoUseCase({ id: '1' });
    expect(
      container.priorityTodoRepository.getOneById({ id: '1' })?.isPrioritized,
    ).toBe(true);

    container.deprioritizeTodoUseCase({ id: '1' });
    expect(
      container.priorityTodoRepository.getOneById({ id: '1' })?.isPrioritized,
    ).toBe(false);
  });
});
