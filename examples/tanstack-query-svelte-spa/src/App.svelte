<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from 'src/core/global/queryClient';
  import ActiveTodo from './routes/ActiveTodo/ActiveTodo.svelte';
  import ArchivedTodo from './routes/ArchivedTodo/ArchivedTodo.svelte';

  type Route = 'active' | 'archived';

  let currentRoute = $state<Route>('active');

  const navigate = (route: Route) => {
    currentRoute = route;
  };
</script>

<QueryClientProvider client={queryClient}>
  <div class="app-layout">
    <header class="app-header">
      <span>Chimeric Svelte Todo</span>
    </header>

    <nav class="app-nav">
      <button
        class="nav-link {currentRoute === 'active' ? 'active' : ''}"
        onclick={() => navigate('active')}
      >
        Active Todos
      </button>
      <button
        class="nav-link {currentRoute === 'archived' ? 'active' : ''}"
        onclick={() => navigate('archived')}
      >
        Archived Todos
      </button>
    </nav>

    <main class="app-main">
      {#if currentRoute === 'active'}
        <ActiveTodo />
      {:else if currentRoute === 'archived'}
        <ArchivedTodo />
      {/if}
    </main>
  </div>
</QueryClientProvider>
