import { defineComponent, h, type Plugin } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';

export { flushPromises };

export function withSetup<T>(
  composable: () => T,
  plugins: Array<[Plugin, unknown?]> = [],
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
      plugins: plugins as unknown as Plugin[],
    },
  });

  return { result, wrapper };
}
