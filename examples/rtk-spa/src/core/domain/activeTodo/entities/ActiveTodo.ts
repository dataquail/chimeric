import { parseISO } from 'date-fns';
import { TodoDto } from '../dtos/out/TodoDto';

export type ActiveTodo = {
  id: string;
  title: string;
  createdAt: Date;
  completedAt: Date | undefined;
};

export const isActiveTodoCompleted = (activeTodo: ActiveTodo): boolean => {
  return activeTodo.completedAt !== undefined;
};

export const mapTodoDtoToActiveTodo = (todoDto: TodoDto): ActiveTodo => ({
  id: todoDto.id,
  title: todoDto.title,
  createdAt: parseISO(todoDto.created_at),
  completedAt: todoDto.completed_at
    ? parseISO(todoDto.completed_at)
    : undefined,
});
