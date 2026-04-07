import { IPriorityTodoRepository } from '@/core/domain/priorityTodo/ports/IPriorityTodoRepository';

export type PrioritizeTodoUseCase = (args: { id: string }) => void;

export const createPrioritizeTodoUseCase = (
  priorityTodoRepository: IPriorityTodoRepository,
): PrioritizeTodoUseCase => (args: { id: string }) => {
  const priorityTodo = priorityTodoRepository.getOneById({ id: args.id });

  if (!priorityTodo) {
    throw new Error('PriorityTodo not found');
  }

  if (priorityTodo.isPrioritized) {
    throw new Error('ActiveTodo already prioritized');
  }

  priorityTodoRepository.save({ id: args.id, isPrioritized: true });
};
