<template>
  <div>
    <div class="page-header">
      <h1>Archived Todo List</h1>
    </div>

    <div v-if="getAll.isPending.value" class="loader-container">
      <div class="loader" />
    </div>
    <div v-else class="scroll-area">
      <div
        v-for="archivedTodo in archivedTodos"
        :key="archivedTodo.id"
        class="archived-card"
      >
        <div class="archived-card-info">
          <div
            v-if="deleteOne.isPending.value || unarchiveOne.isPending.value"
            class="loader loader-sm"
          />
          <h4>{{ archivedTodo.title }}</h4>
          <span class="text-sm">Completed At: {{ formatDate(archivedTodo.completedAt) }}</span>
          <span class="text-sm">Archived At: {{ formatDate(archivedTodo.archivedAt) }}</span>
        </div>
        <div class="menu-wrapper" :ref="(el) => setMenuRef(archivedTodo.id, el as Element | null)">
          <button
            type="button"
            class="menu-trigger"
            @click="toggleMenu(archivedTodo.id)"
          >
            &#8942;
          </button>
          <div v-if="openMenuId === archivedTodo.id" class="menu-dropdown">
            <div class="menu-label">Archived Todo Options</div>
            <button
              type="button"
              class="menu-item"
              @click="handleUnarchive(archivedTodo.id)"
            >
              Unarchive
            </button>
            <button
              type="button"
              class="menu-item danger"
              @click="handleDelete(archivedTodo.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="getAll.hasNextPage.value" class="flex-center">
        <button
          type="button"
          class="btn btn-light"
          @click="getAll.fetchNextPage()"
          :disabled="getAll.isFetchingNextPage.value"
        >
          <span v-if="getAll.isFetchingNextPage.value" class="loader loader-sm" />
          <span v-else>Load More</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { archivedTodoService } from 'src/core/infrastructure/services/ArchivedTodoService';
import {
  mapArchivedTodoDtoToArchivedTodo,
} from 'src/core/domain/archivedTodo/entities/ArchivedTodo';
import type { ArchivedTodoPageDto } from 'src/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';
import { formatDate } from 'src/utils/formatDate';

const getAll = archivedTodoService.getAll.useHook();
const deleteOne = archivedTodoService.deleteOne.useHook();
const unarchiveOne = archivedTodoService.unarchiveOne.useHook();

const archivedTodos = computed(() => {
  const pages = (getAll.data.value?.pages ?? []) as ArchivedTodoPageDto[];
  return pages.flatMap((page) =>
    page.list.map(mapArchivedTodoDtoToArchivedTodo),
  );
});

const openMenuId = ref<string | null>(null);
const menuRefs = ref<Map<string, Element>>(new Map());

const setMenuRef = (id: string, el: Element | null) => {
  if (el) {
    menuRefs.value.set(id, el);
  } else {
    menuRefs.value.delete(id);
  }
};

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleClickOutside = (e: MouseEvent) => {
  if (!openMenuId.value) return;
  const menuEl = menuRefs.value.get(openMenuId.value);
  if (menuEl && !menuEl.contains(e.target as Node)) {
    openMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const handleUnarchive = (id: string) => {
  void unarchiveOne.invoke({ id });
  openMenuId.value = null;
};

const handleDelete = (id: string) => {
  void deleteOne.invoke({ id });
  openMenuId.value = null;
};
</script>
