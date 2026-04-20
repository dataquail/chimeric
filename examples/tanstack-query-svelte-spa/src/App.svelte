<script lang="ts">
  import { QueryClientProvider } from '@tanstack/svelte-query';
  import { queryClient } from 'src/core/global/queryClient';
  import ActiveTodo from './routes/ActiveTodo/ActiveTodo.svelte';
  import ArchivedTodo from './routes/ArchivedTodo/ArchivedTodo.svelte';
  import Review from './routes/Review/Review.svelte';

  type Route = 'active' | 'archived' | 'review';

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
      <a
        href="#active"
        class="nav-link {currentRoute === 'active' ? 'active' : ''}"
        onclick={(e) => { e.preventDefault(); navigate('active'); }}
      >
        Active Todos
      </a>
      <a
        href="#archived"
        class="nav-link {currentRoute === 'archived' ? 'active' : ''}"
        onclick={(e) => { e.preventDefault(); navigate('archived'); }}
      >
        Archived Todos
      </a>
      <a
        href="#review"
        class="nav-link {currentRoute === 'review' ? 'active' : ''}"
        onclick={(e) => { e.preventDefault(); navigate('review'); }}
      >
        Review Todos
      </a>
    </nav>

    <main class="app-main">
      {#if currentRoute === 'active'}
        <ActiveTodo />
      {:else if currentRoute === 'archived'}
        <ArchivedTodo />
      {:else if currentRoute === 'review'}
        <Review />
      {/if}
    </main>
  </div>
</QueryClientProvider>
