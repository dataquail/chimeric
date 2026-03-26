import { DefineChimericSync } from '@chimeric/react';
import { ReviewedTodo } from '../entities/ReviewedTodo';

export type IReviewedTodoRepository = {
  save: (reviewedTodo: ReviewedTodo) => void;
  saveMany: (reviewedTodos: ReviewedTodo[]) => void;
  delete: (args: { id: string }) => void;
  getOneById: DefineChimericSync<
    (args: { id: string }) => ReviewedTodo | undefined
  >;
};
