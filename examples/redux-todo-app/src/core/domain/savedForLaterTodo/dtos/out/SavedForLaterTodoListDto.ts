import { SavedForLaterTodoDto } from './SavedForLaterTodoDto';

export type SavedForLaterTodoListDto = {
  total_count: number;
  list: SavedForLaterTodoDto[];
};
