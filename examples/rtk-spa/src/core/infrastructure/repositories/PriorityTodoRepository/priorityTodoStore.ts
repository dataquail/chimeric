import 'immer';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PriorityTodo } from 'src/core/domain/priorityTodo/ports/IPriorityTodoRepository';
import { revertAll } from 'src/lib/features/revertAll';

export type PriorityTodoRecord = {
  id: string;
  isPrioritized: boolean;
};

export type PriorityTodoDict = {
  [key: string]: PriorityTodoRecord | undefined;
};

const initialState: { dict: PriorityTodoDict } = {
  dict: {},
};

export const priorityTodoSlice = createSlice({
  name: 'priorityTodo',
  initialState,
  reducers: {
    savePriorityTodo: (state, action: PayloadAction<PriorityTodo>) => {
      state.dict[action.payload.id] = {
        id: action.payload.id,
        isPrioritized: action.payload.isPrioritized,
      };
    },
    saveManyPriorityTodos: (state, action: PayloadAction<PriorityTodo[]>) => {
      for (const todo of action.payload) {
        state.dict[todo.id] = {
          id: todo.id,
          isPrioritized: todo.isPrioritized,
        };
      }
    },
    deletePriorityTodo: (state, action: PayloadAction<{ id: string }>) => {
      delete state.dict[action.payload.id];
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const { savePriorityTodo, saveManyPriorityTodos, deletePriorityTodo } =
  priorityTodoSlice.actions;
export const priorityTodoReducer = priorityTodoSlice.reducer;
