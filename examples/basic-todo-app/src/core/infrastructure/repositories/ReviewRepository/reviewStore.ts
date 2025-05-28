import 'immer';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Review } from 'src/core/domain/review/entities/Review';
import { revertAll } from 'src/lib/features/revertAll';

export type ReviewRecord = {
  createdAt: string;
  todoIdList: string[];
};

const initialState: { record: ReviewRecord | undefined } = {
  record: undefined,
};

const toRecord = (review: Review): ReviewRecord => ({
  createdAt: review.createdAt.toISOString(),
  todoIdList: review.todoIdList,
});

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    saveReview: (state, action: PayloadAction<Review>) => {
      state.record = toRecord(action.payload);
    },
    deleteReview: (state) => {
      state.record = undefined;
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const { saveReview, deleteReview } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
