import { defineComponent, h } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

export { flushPromises };

export const getTestWrapper = (queryClient: QueryClient) => ({
  global: {
    plugins: [[VueQueryPlugin, { queryClient }]],
  },
});

export function withQuerySetup<T>(
  composable: () => T,
  queryClient: QueryClient,
): { result: T; wrapper: ReturnType<typeof mount> } {
  let result!: T;

  const TestComponent = defineComponent({
    setup() {
      result = composable();
      return {};
    },
    render: () => h('div'),
  });

  const wrapper = mount(TestComponent, {
    global: {
      plugins: [[VueQueryPlugin, { queryClient }]],
    },
  });

  return { result, wrapper };
}
