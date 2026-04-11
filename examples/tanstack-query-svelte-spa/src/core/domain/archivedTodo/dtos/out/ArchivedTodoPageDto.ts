import { ArchivedTodoDto } from './ArchivedTodoDto';

export type ArchivedTodoPageDto = {
  list: ArchivedTodoDto[];
  total: number;
  page: number;
};
