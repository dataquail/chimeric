import { parseISO } from 'date-fns';
import { ArchivedTodoDto } from 'src/core/domain/archivedTodo/dtos/out/ArchivedTodoDto';

export type ArchivedTodo = {
  id: string;
  title: string;
  completedAt: Date;
  archivedAt: Date;
};

export const mapArchivedTodoDtoToArchivedTodo = (
  archivedTodoDto: ArchivedTodoDto,
): ArchivedTodo => ({
  id: archivedTodoDto.id,
  title: archivedTodoDto.title,
  completedAt: parseISO(archivedTodoDto.completed_at),
  archivedAt: parseISO(archivedTodoDto.archived_at),
});
