export class TestTodoStore {
  private nextId = 0;
  private todos: { id: number; text: string }[] = [];
  private listeners: (() => void)[] = [];

  addTodo() {
    this.todos = [
      ...this.todos,
      { id: this.nextId++, text: 'Todo #' + this.nextId },
    ];
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getSnapshot() {
    return this.todos;
  }
}
