import { v4 } from 'uuid';
import { ArchivedTodoDto, ArchivedTodoPageDto } from '../types';

export class ArchivedTodoRepository {
  private archivedTodoList: ArchivedTodoDto[] = [];

  public getPage(page: number, limit: number): ArchivedTodoPageDto {
    const start = page * limit;
    const end = start + limit;
    const list = this.archivedTodoList.slice(start, end);
    const hasMore = end < this.archivedTodoList.length;
    return {
      list,
      next_cursor: hasMore ? page + 1 : null,
    };
  }

  public getOneById(id: string): ArchivedTodoDto | undefined {
    return this.archivedTodoList.find((todo) => todo.id === id);
  }

  public create(title: string, completed_at: string): string {
    const id = v4();
    this.archivedTodoList.push({
      id,
      title,
      completed_at,
      archived_at: new Date().toISOString(),
    });
    return id;
  }

  public delete(id: string): void {
    this.archivedTodoList = this.archivedTodoList.filter(
      (todo) => todo.id !== id
    );
  }
}
