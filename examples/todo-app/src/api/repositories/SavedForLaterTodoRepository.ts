import { SavedForLaterTodoDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';
import { SavedForLaterTodoListDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoListDto';
import { v4 } from 'uuid';

export class SavedForLaterTodoRepository {
  private savedForLaterTodoList: SavedForLaterTodoDto[] = [];

  public getAll(): SavedForLaterTodoListDto {
    return {
      total_count: this.savedForLaterTodoList.length,
      list: this.savedForLaterTodoList,
    };
  }

  public getOneById(id: string): SavedForLaterTodoDto | undefined {
    return this.savedForLaterTodoList.find((todo) => todo.id === id);
  }

  public create(title: string, created_at: string): string {
    const id = v4();
    this.savedForLaterTodoList.push({
      id,
      title,
      created_at,
    });
    return id;
  }

  public delete(id: string): void {
    this.savedForLaterTodoList = this.savedForLaterTodoList.filter(
      (todo) => todo.id !== id,
    );
    return;
  }
}
