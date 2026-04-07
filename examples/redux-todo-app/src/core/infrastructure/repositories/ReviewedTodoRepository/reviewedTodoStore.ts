import 'immer';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { revertAll } from 'src/lib/features/revertAll';

export type ReviewedTodoRecord = {
  id: string;
  lastReviewedAt: string;
};

export type ReviewedTodoDict = {
  [key: string]: ReviewedTodoRecord | undefined;
};

const initialState: ReviewedTodoDict = {};

const toRecord = (reviewedTodo: ReviewedTodo): ReviewedTodoRecord => ({
  id: reviewedTodo.id,
  lastReviewedAt: reviewedTodo.lastReviewedAt.toISOString(),
});

export const reviewedTodoSlice = createSlice({
  name: 'reviewedTodo',
  initialState,
  reducers: {
    saveReviewedTodo: (state, action: PayloadAction<ReviewedTodo>) => {
      state[action.payload.id] = toRecord(action.payload);
    },
    saveManyReviewedTodos: (state, action: PayloadAction<ReviewedTodo[]>) => {
      action.payload.forEach((reviewedTodo) => {
        state[reviewedTodo.id] = toRecord(reviewedTodo);
      });
    },
    deleteReviewedTodo: (state, action: PayloadAction<{ id: string }>) => {
      delete state[action.payload.id];
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const { saveReviewedTodo, saveManyReviewedTodos, deleteReviewedTodo } =
  reviewedTodoSlice.actions;
export const reviewedTodoReducer = reviewedTodoSlice.reducer;
