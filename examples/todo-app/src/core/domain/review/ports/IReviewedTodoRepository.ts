import { ChimericReadFactory } from 'src/utils/domain/ChimericRead';
import { ReviewedTodo } from '../entities/ReviewedTodo';

export type IReviewedTodoRepository = {
  save: (reviewedTodo: ReviewedTodo) => void;
  saveMany: (reviewedTodos: ReviewedTodo[]) => void;
  delete: (args: { id: string }) => void;
  getOneById: ChimericReadFactory<
    (args: { id: string }) => ReviewedTodo | undefined
  >;
};
