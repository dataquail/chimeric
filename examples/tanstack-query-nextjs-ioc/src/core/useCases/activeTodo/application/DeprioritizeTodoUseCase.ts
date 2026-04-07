import { IPriorityTodoRepository } from '@/core/domain/priorityTodo/ports/IPriorityTodoRepository';

export type DeprioritizeTodoUseCase = (args: { id: string }) => void;

export const createDeprioritizeTodoUseCase = (
  priorityTodoRepository: IPriorityTodoRepository,
): DeprioritizeTodoUseCase => (args: { id: string }) => {
  const priorityTodo = priorityTodoRepository.getOneById({ id: args.id });

  if (!priorityTodo) {
    throw new Error('PriorityTodo not found');
  }

  if (!priorityTodo.isPrioritized) {
    throw new Error('ActiveTodo already deprioritized');
  }

  priorityTodoRepository.save({ id: args.id, isPrioritized: false });
};
