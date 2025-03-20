import { parseISO } from 'date-fns';
import { TodoDto } from '../dtos/out/TodoDto';

export type ActiveTodo = {
  id: string;
  title: string;
  createdAt: Date;
  completedAt: Date | undefined;
  isPrioritized: boolean | null;
};

export const prioritizeActiveTodo = (activeTodo: ActiveTodo): ActiveTodo => {
  if (activeTodo.isPrioritized) {
    throw new Error('ActiveTodo already prioritized');
  } else {
    return {
      ...activeTodo,
      isPrioritized: true,
    };
  }
};

export const deprioritizeActiveTodo = (activeTodo: ActiveTodo): ActiveTodo => {
  if (!activeTodo.isPrioritized) {
    throw new Error('ActiveTodo already deprioritized');
  } else {
    return {
      ...activeTodo,
      isPrioritized: false,
    };
  }
};

export const isActiveTodoPrioritized = (activeTodo: ActiveTodo): boolean => {
  return Boolean(activeTodo.isPrioritized);
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
  isPrioritized: null,
});
