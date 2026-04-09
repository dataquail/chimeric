import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'Chimeric',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/dataquail/chimeric',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'getting-started/introduction' },
            { slug: 'getting-started/installation' },
          ],
        },
        {
          label: 'Philosophy',
          items: [
            { slug: 'philosophy/interfaces' },
            { slug: 'philosophy/orchestration' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { slug: 'guides/core-concepts' },
            { slug: 'guides/define-types' },
            { slug: 'guides/nextjs' },
            { slug: 'guides/suspense' },
            { slug: 'guides/testing' },
          ],
        },
        {
          label: 'API',
          items: [
            { slug: 'api/sync', label: 'Sync' },
            { slug: 'api/async', label: 'Async' },
            { slug: 'api/eager-async', label: 'EagerAsync' },
            { slug: 'api/query' },
            { slug: 'api/mutation' },
            { slug: 'api/infinite-query' },
            { slug: 'api/sync-reducer', label: 'SyncReducer' },
            { slug: 'api/async-reducer', label: 'AsyncReducer' },
          ],
        },
        {
          label: 'React Query',
          collapsed: true,
          items: [
            { slug: 'api/react-query', label: 'Overview' },
            { slug: 'api/react-query/query-factory' },
            { slug: 'api/react-query/mutation-factory' },
            { slug: 'api/react-query/infinite-query-factory' },
            { slug: 'api/react-query/reducers' },
          ],
        },
        {
          label: 'RTK Query',
          collapsed: true,
          items: [
            { slug: 'api/rtk-query', label: 'Overview' },
            { slug: 'api/rtk-query/query-factory' },
            { slug: 'api/rtk-query/mutation-factory' },
            { slug: 'api/rtk-query/infinite-query-factory' },
            { slug: 'api/rtk-query/reducers' },
          ],
        },
      ],
    }),
  ],
  site: 'https://dataquail.github.io',
  base: '/chimeric',
});
