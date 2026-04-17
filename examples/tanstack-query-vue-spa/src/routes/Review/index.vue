<template>
  <div>
    <div class="page-header">
      <h1>Review Completed Todos</h1>
      <button
        v-if="hasStartedReview"
        type="button"
        class="btn"
        @click="handleFinishReview"
        :disabled="finishReview.isPending.value"
      >
        <span v-if="finishReview.isPending.value" class="loader loader-sm" />
        <span v-else>Archive &amp; Finish</span>
      </button>
      <button
        v-else
        type="button"
        class="btn"
        @click="handleStartReview"
        :disabled="startReview.isPending.value"
      >
        <span v-if="startReview.isPending.value" class="loader loader-sm" />
        <span v-else>Start Review</span>
      </button>
    </div>

    <div class="spacer-lg" />

    <p v-if="!hasStartedReview" class="text-dimmed">
      Start a review to see all completed todos. Uncheck any you want to keep
      active. The rest will be archived when you finish.
    </p>

    <div v-if="startReview.isPending.value || todosUnderReview.isPending.value" class="loader" />
    <div v-else class="scroll-area">
      <div
        v-for="todo in todosUnderReview.data.value ?? []"
        :key="todo.id"
        class="todo-card"
      >
        <div
          class="checkbox-card"
          :class="{
            checked: !isExempted(todo),
            disabled: uncompleteOne.isPending.value,
          }"
          role="checkbox"
          :aria-checked="!isExempted(todo)"
          @click="handleUncomplete(todo.id, isExempted(todo))"
        >
          <div
            v-if="uncompleteOne.isPending.value"
            class="loader loader-sm"
            style="margin: 0.5rem"
          />
          <div
            v-else
            class="checkbox-indicator"
            :class="{ checked: !isExempted(todo) }"
          />
          <div class="todo-info">
            <h4 :class="{ dimmed: isExempted(todo) }">{{ todo.title }}</h4>
            <span class="text-sm">Created At: {{ formatDate(todo.createdAt) }}</span>
            <span v-if="isExempted(todo)" class="text-sm text-dimmed text-italic">
              Uncompleted — will not be archived
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { startReviewUseCase } from 'src/core/useCases/review/startReviewUseCase';
import { finishReviewUseCase } from 'src/core/useCases/review/finishReviewUseCase';
import { getTodosUnderReviewUseCase, TodoUnderReview } from 'src/core/useCases/review/getTodosUnderReviewUseCase';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { formatDate } from 'src/utils/formatDate';

const reviewRef = reviewRepository.get.useHook();
const hasStartedReview = computed(() => Boolean(reviewRef.value));

const startReview = startReviewUseCase.useHook();
const finishReview = finishReviewUseCase.useHook();
const todosUnderReview = getTodosUnderReviewUseCase.useHook();
const uncompleteOne = activeTodoService.uncompleteOne.useHook();

const isExempted = (todo: TodoUnderReview): boolean => !todo.completedAt;

const handleStartReview = () => {
  void startReview.invoke();
};

const handleFinishReview = () => {
  void finishReview.invoke();
};

const handleUncomplete = (id: string, exempted: boolean) => {
  if (!exempted && !uncompleteOne.isPending.value) {
    void uncompleteOne.invoke({ id });
  }
};
</script>
