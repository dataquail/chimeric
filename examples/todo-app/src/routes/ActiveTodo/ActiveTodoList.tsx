import { Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { ActiveTodoCard } from './ActiveTodoCard';
import { injectComponent } from 'src/utils/inversify/InjectComponent/DI';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type InjectedProps = {
  activeTodoService: InjectionType<'IActiveTodoService'>;
};

export const ActiveTodoList = injectComponent<InjectedProps>(
  { activeTodoService: InjectionSymbol('IActiveTodoService') },
  ({ activeTodoService }) => {
    const { data, isPending } = activeTodoService.getAll.use();
    const { height } = useViewportSize();

    if (isPending || !data) {
      return (
        <Flex justify="center" align="center" w="100%" h="100%">
          <Loader />
        </Flex>
      );
    }

    return (
      <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
        {data.map((todo) => (
          <ActiveTodoCard key={todo.id} todo={todo} />
        ))}
      </ScrollArea.Autosize>
    );
  },
);
