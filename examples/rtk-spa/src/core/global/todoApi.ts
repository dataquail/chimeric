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
import { SavedForLaterTodoListDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoListDto';
import { SavedForLaterTodoDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';
import {
  SavedForLaterTodo,
  mapSavedForLaterTodoDtoToSavedForLaterTodo,
} from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { SaveForLaterBody } from 'src/core/domain/savedForLaterTodo/dtos/in/SaveForLaterBody';
import { ActivateBody } from 'src/core/domain/savedForLaterTodo/dtos/in/ActivateBody';
import { SavedForLaterTodoDeletedEvent } from 'src/core/domain/savedForLaterTodo/events/SavedForLaterTodoDeletedEvent';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ActiveTodo', 'SavedForLaterTodo'],
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
    getActiveTodoById: build.query<ActiveTodo | undefined, { id: string }>({
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
    // Saved For Later Todo queries
    getAllSavedForLaterTodos: build.query<SavedForLaterTodo[], void>({
      queryFn: async () => {
        const savedForLaterTodoListDto =
          await wrappedFetch<SavedForLaterTodoListDto>(
            `${getConfig().API_URL}/saved-for-later-todo`,
          );
        const savedForLaterTodos = savedForLaterTodoListDto.list.map(
          mapSavedForLaterTodoDtoToSavedForLaterTodo,
        );
        return { data: savedForLaterTodos };
      },
      providesTags: ['SavedForLaterTodo'],
    }),
    getSavedForLaterTodoById: build.query<
      SavedForLaterTodo,
      { id: string }
    >({
      queryFn: async (args) => {
        const savedForLaterTodoDto = await wrappedFetch<SavedForLaterTodoDto>(
          `${getConfig().API_URL}/saved-for-later-todo/${args.id}`,
        );
        return {
          data: mapSavedForLaterTodoDtoToSavedForLaterTodo(
            savedForLaterTodoDto,
          ),
        };
      },
      providesTags: (_result, _error, args) => [
        { type: 'SavedForLaterTodo', id: args.id },
      ],
    }),
    // Saved For Later Todo mutations
    saveForLater: build.mutation<{ id: string }, SaveForLaterBody>({
      queryFn: async (body) => {
        const data = await wrappedFetch<{ id: string }>(
          `${getConfig().API_URL}/saved-for-later-todo/save-for-later`,
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
      invalidatesTags: ['ActiveTodo', 'SavedForLaterTodo'],
    }),
    activateSavedTodo: build.mutation<{ id: string }, ActivateBody>({
      queryFn: async (body) => {
        const data = await wrappedFetch<{ id: string }>(
          `${getConfig().API_URL}/saved-for-later-todo/activate`,
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
      invalidatesTags: ['ActiveTodo', 'SavedForLaterTodo'],
    }),
    deleteSavedForLaterTodo: build.mutation<void, { id: string }>({
      queryFn: async (args) => {
        await wrappedFetch(
          `${getConfig().API_URL}/saved-for-later-todo/${args.id}`,
          {
            method: 'delete',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        applicationEventEmitter.emit(
          new SavedForLaterTodoDeletedEvent({ id: args.id }),
        );
        return { data: undefined };
      },
      invalidatesTags: ['SavedForLaterTodo'],
    }),
  }),
});
