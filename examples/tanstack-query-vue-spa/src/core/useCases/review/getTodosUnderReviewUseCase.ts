import { computed } from 'vue';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';

export type TodoUnderReview = {
  id: string;
  title: string;
  createdAt: Date;
  completedAt: Date | undefined;
};

export const getTodosUnderReviewUseCase = {
  useHook: () => {
    const activeTodosQuery = activeTodoService.getAll.useHook();
    const reviewRef = reviewRepository.get.useHook();

    const data = computed((): TodoUnderReview[] => {
      const review = reviewRef.value;
      if (!review) return [];

      const todos = activeTodosQuery.data.value ?? [];

      return review.todoIdList.reduce<TodoUnderReview[]>((acc, todoId) => {
        const activeTodo = todos.find((t) => t.id === todoId);
        if (!activeTodo) return acc;
        return [
          ...acc,
          {
            id: activeTodo.id,
            title: activeTodo.title,
            createdAt: activeTodo.createdAt,
            completedAt: activeTodo.completedAt,
          },
        ];
      }, []);
    });

    return {
      data,
      isPending: activeTodosQuery.isPending,
    };
  },
};
