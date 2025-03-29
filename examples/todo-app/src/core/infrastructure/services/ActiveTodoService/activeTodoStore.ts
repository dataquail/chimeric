import 'immer';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { revertAll } from 'src/lib/features/revertAll';

type ActiveTodoDictionary = {
  [id: string]: ActiveTodo | undefined;
};

const initialState = {
  dict: {} as ActiveTodoDictionary,
};

export const activeTodosSlice = createSlice({
  name: 'activeTodo',
  initialState,
  reducers: {
    saveActiveTodo: (state, action: PayloadAction<ActiveTodo>) => {
      const newActiveTodo = action.payload;
      const oldActiveTodo = state.dict[action.payload.id];
      state.dict[action.payload.id] = {
        ...state.dict[action.payload.id],
        ...action.payload,
        isPrioritized: getIsPrioritizedValueToSave(
          newActiveTodo,
          oldActiveTodo,
        ),
      };
    },
    saveAllActiveTodos: (state, action: PayloadAction<ActiveTodo[]>) => {
      const newActiveTodos = action.payload;
      for (const newActiveTodo of newActiveTodos) {
        const oldActiveTodo = state.dict[newActiveTodo.id];
        state.dict[newActiveTodo.id] = {
          ...state.dict[newActiveTodo.id],
          ...newActiveTodo,
          isPrioritized: getIsPrioritizedValueToSave(
            newActiveTodo,
            oldActiveTodo,
          ),
        };
      }
      const recordsNotPresentInNewActiveTodos = Object.keys(state.dict).filter(
        (key) => !newActiveTodos.some((todo) => todo.id === key),
      );
      for (const recordNotPresentInNewActiveTodos of recordsNotPresentInNewActiveTodos) {
        delete state.dict[recordNotPresentInNewActiveTodos];
      }
    },
    removeActiveTodo: (state, action: PayloadAction<string>) => {
      const activeTodoId = action.payload;
      delete state.dict[activeTodoId];
    },
    removeAllActiveTodos: (state) => {
      state.dict = {};
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const {
  saveActiveTodo,
  saveAllActiveTodos,
  removeActiveTodo,
  removeAllActiveTodos,
} = activeTodosSlice.actions;
export const activeTodosReducer = activeTodosSlice.reducer;

// UTILS
const getIsPrioritizedValueToSave = (
  newActiveTodo: ActiveTodo,
  oldActiveTodo: ActiveTodo | undefined,
): boolean => {
  // Check if new activeTodo has explicit isPrioritized value
  if (
    newActiveTodo.isPrioritized === false ||
    newActiveTodo.isPrioritized === true
  ) {
    return newActiveTodo.isPrioritized;
  }

  // Check if old activeTodo has explicit isPrioritized value
  if (
    oldActiveTodo?.isPrioritized === false ||
    oldActiveTodo?.isPrioritized === true
  ) {
    return oldActiveTodo.isPrioritized;
  }

  // Default value
  return false;
};
