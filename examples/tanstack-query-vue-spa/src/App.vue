<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="avatar">C</div>
    </header>

    <nav class="app-nav">
      <RouterLink to="/" class="nav-link" :class="{ active: isActive('/') }">
        Active Todos
      </RouterLink>
      <RouterLink
        to="/archived"
        class="nav-link"
        :class="{ active: isActive('/archived') }"
      >
        Archived Todos
      </RouterLink>
      <RouterLink
        to="/review"
        class="nav-link"
        :class="{ active: isActive('/review') }"
      >
        Review Todos
      </RouterLink>
    </nav>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path: string): boolean => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>
