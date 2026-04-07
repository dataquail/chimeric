import { parseISO } from 'date-fns';
import { SavedForLaterTodoDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';

export type SavedForLaterTodo = {
  id: string;
  title: string;
  createdAt: Date;
};

export const mapSavedForLaterTodoDtoToSavedForLaterTodo = (
  savedForLaterTodoDto: SavedForLaterTodoDto,
): SavedForLaterTodo => ({
  id: savedForLaterTodoDto.id,
  title: savedForLaterTodoDto.title,
  createdAt: parseISO(savedForLaterTodoDto.created_at),
});
