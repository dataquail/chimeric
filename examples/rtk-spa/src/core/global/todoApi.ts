import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { getConfig } from 'src/utils/getConfig';
import { TodoListDto } from 'src/core/domain/activeTodo/dtos/out/TodoListDto';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';
import { CreateTodoBody } from 'src/core/domain/activeTodo/dtos/in/CreateTodoBody';
import {
  ActiveTodo,
  mapTodoDtoToActiveTodo,
} from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { ActiveTodosFetchedEvent } from 'src/core/domain/activeTodo/events/ActiveTodosFetchedEvent';
import { ActiveTodoDeletedEvent } from 'src/core/domain/activeTodo/events/ActiveTodoDeletedEvent';
import { applicationEventEmitter } from './applicationEventEmitter';
import { ArchivedTodoPageDto } from 'src/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';
import { ArchiveBody } from 'src/core/domain/archivedTodo/dtos/in/ArchiveBody';
import { ArchivedTodoDeletedEvent } from 'src/core/domain/archivedTodo/events/ArchivedTodoDeletedEvent';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ActiveTodo', 'ArchivedTodo'],
  endpoints: (build) => ({
    // Active Todo queries
    getAllActiveTodos: build.query<ActiveTodo[], void>({
      queryFn: async () => {
        const todoListDto = await wrappedFetch<TodoListDto>(
          `${getConfig().API_URL}/active-todo`,
        );
        const activeTodos = todoListDto.list.map(mapTodoDtoToActiveTodo);
        applicationEventEmitter.emit(
          new ActiveTodosFetchedEvent({
            ids: activeTodos.map((todo) => todo.id),
          }),
        );
        return { data: activeTodos };
      },
      providesTags: ['ActiveTodo'],
    }),
    getActiveTodoById: build.query<ActiveTodo, { id: string }>({
      queryFn: async (args) => {
        const activeTodoDto = await wrappedFetch<TodoDto>(
          `${getConfig().API_URL}/active-todo/${args.id}`,
        );
        return { data: mapTodoDtoToActiveTodo(activeTodoDto) };
      },
      providesTags: (_result, _error, args) => [
        { type: 'ActiveTodo', id: args.id },
      ],
    }),
    // Active Todo mutations
    createActiveTodo: build.mutation<{ id: string }, CreateTodoBody>({
      queryFn: async (body) => {
        const data = await wrappedFetch<{ id: string }>(
          `${getConfig().API_URL}/active-todo`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );
        return { data };
      },
      invalidatesTags: ['ActiveTodo'],
    }),
    deleteActiveTodo: build.mutation<void, { id: string }>({
      queryFn: async (args) => {
        await wrappedFetch(
          `${getConfig().API_URL}/active-todo/${args.id}`,
          {
            method: 'delete',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        applicationEventEmitter.emit(
          new ActiveTodoDeletedEvent({ id: args.id }),
        );
        return { data: undefined };
      },
      invalidatesTags: ['ActiveTodo'],
    }),
    completeActiveTodo: build.mutation<void, { id: string }>({
      queryFn: async (args) => {
        await wrappedFetch(
          `${getConfig().API_URL}/active-todo/${args.id}/complete`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        return { data: undefined };
      },
      invalidatesTags: ['ActiveTodo'],
    }),
    uncompleteActiveTodo: build.mutation<{ id: string }, { id: string }>({
      queryFn: async (args) => {
        await wrappedFetch(
          `${getConfig().API_URL}/active-todo/${args.id}/uncomplete`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        return { data: args };
      },
      invalidatesTags: ['ActiveTodo'],
    }),
    // Archived Todo queries
    getAllArchivedTodos: build.infiniteQuery<
      ArchivedTodoPageDto,
      void,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (
          lastPage: ArchivedTodoPageDto,
          _allPages: ArchivedTodoPageDto[],
          lastPageParam: number,
        ) => lastPage.next_cursor ?? undefined,
      },
      queryFn: async ({ pageParam }) => {
        const data = await wrappedFetch<ArchivedTodoPageDto>(
          `${getConfig().API_URL}/archived-todo?page=${pageParam}&limit=10`,
        );
        return { data };
      },
      providesTags: ['ArchivedTodo'],
    }),
    // Archived Todo mutations
    archiveCompletedTodos: build.mutation<{ ids: string[] }, ArchiveBody>({
      queryFn: async (body) => {
        const data = await wrappedFetch<{ ids: string[] }>(
          `${getConfig().API_URL}/archived-todo/archive`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          },
        );
        return { data };
      },
      invalidatesTags: ['ArchivedTodo', 'ActiveTodo'],
    }),
    unarchiveArchivedTodo: build.mutation<{ id: string }, { id: string }>({
      queryFn: async (args) => {
        const data = await wrappedFetch<{ id: string }>(
          `${getConfig().API_URL}/archived-todo/${args.id}/unarchive`,
          {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        return { data };
      },
      invalidatesTags: ['ArchivedTodo', 'ActiveTodo'],
    }),
    deleteArchivedTodo: build.mutation<void, { id: string }>({
      queryFn: async (args) => {
        await wrappedFetch(
          `${getConfig().API_URL}/archived-todo/${args.id}`,
          {
            method: 'delete',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        applicationEventEmitter.emit(
          new ArchivedTodoDeletedEvent({ id: args.id }),
        );
        return { data: undefined };
      },
      invalidatesTags: ['ArchivedTodo'],
    }),
  }),
});
