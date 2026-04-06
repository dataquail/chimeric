import { IReviewedTodoRepository } from '@/core/domain/review/ports/IReviewedTodoRepository';
import {
  ReviewedTodoRecord,
  ReviewedTodoStore,
  useReviewedTodoStore,
} from './reviewedTodoStore';
import { ReviewedTodo } from '@/core/domain/review/entities/ReviewedTodo';
import { CreateChimericSyncFactory } from '@chimeric/react';

const ChimericSyncFactory = CreateChimericSyncFactory<ReviewedTodoStore>({
  getState: () => useReviewedTodoStore.getState(),
  useSelector: useReviewedTodoStore,
});

const toDomain = (record: ReviewedTodoRecord): ReviewedTodo => ({
  id: record.id,
  lastReviewedAt: new Date(record.lastReviewedAt),
});

export const createReviewedTodoRepository = (): IReviewedTodoRepository => ({
  save: (reviewedTodo: ReviewedTodo) => {
    useReviewedTodoStore.getState().saveReviewedTodo(reviewedTodo);
  },
  delete: (args: { id: string }) => {
    useReviewedTodoStore.getState().deleteReviewedTodo(args);
  },
  saveMany: (reviewedTodos: ReviewedTodo[]) => {
    useReviewedTodoStore.getState().saveManyReviewedTodos(reviewedTodos);
  },
  getOneById: ChimericSyncFactory({
    selector: (args: { id: string }) => (state) => state.dict[args.id],
    reducer: (record) => (record ? toDomain(record) : undefined),
  }),
});
