import {
  deleteReviewedTodo,
  ReviewedTodoRecord,
  saveManyReviewedTodos,
  saveReviewedTodo,
} from './reviewedTodoStore';
import { ReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { appStore } from 'src/core/global/appStore';
import { IReviewedTodoRepository } from 'src/core/domain/review/ports/IReviewedTodoRepository';
import { ChimericSyncFactory } from 'src/utils/domain/ChimericSyncFactory';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/lib/store';

const selectTodoById = createSelector(
  [
    (state: RootState) => state.todo.reviewedTodo,
    (_state: RootState, id: string) => id,
  ],
  (reviewedTodos, id) => {
    const record = reviewedTodos[id];
    return record ? toDomain(record) : undefined;
  },
);

export const reviewedTodoRepository: IReviewedTodoRepository = {
  save: (reviewedTodo: ReviewedTodo) => {
    appStore.dispatch(saveReviewedTodo(reviewedTodo));
  },

  delete: (args: { id: string }) => {
    appStore.dispatch(deleteReviewedTodo(args));
  },

  saveMany: (reviewedTodos: ReviewedTodo[]) => {
    appStore.dispatch(saveManyReviewedTodos(reviewedTodos));
  },

  getOneById: ChimericSyncFactory({
    selector: (args: { id: string }) => (state) =>
      selectTodoById(state, args.id),
  }),
};

const toDomain = (record: ReviewedTodoRecord): ReviewedTodo => {
  return {
    id: record.id,
    lastReviewedAt: new Date(record.lastReviewedAt),
  };
};
