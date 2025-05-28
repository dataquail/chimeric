import { useAppSelector } from 'src/lib/store';
import {
  deleteReviewedTodo,
  ReviewedTodoRecord,
  saveManyReviewedTodos,
  saveReviewedTodo,
} from './reviewedTodoStore';
import { ReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/react';
import { appStore } from 'src/core/global/appStore';
import { IReviewedTodoRepository } from 'src/core/domain/review/ports/IReviewedTodoRepository';

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

  getOneById: fuseChimericSync({
    idiomatic: createIdiomaticSync((args: { id: string }) => {
      const record = appStore.getState().todo.reviewedTodo[args.id];
      return record ? toDomain(record) : undefined;
    }),
    reactive: createReactiveSync((args: { id: string }) => {
      const record = useAppSelector(
        (state) => state.todo.reviewedTodo[args.id],
      );
      return record ? toDomain(record) : undefined;
    }),
  }),
};

const toDomain = (record: ReviewedTodoRecord): ReviewedTodo => {
  return {
    id: record.id,
    lastReviewedAt: new Date(record.lastReviewedAt),
  };
};
