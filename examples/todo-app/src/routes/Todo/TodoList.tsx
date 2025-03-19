import { Flex, Loader, ScrollArea } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { TodoCard } from './TodoCard';
import { injectComponent } from 'src/utils/inversify/injectComponent';
import { appContainer } from 'src/core/global/appContainer';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type InjectedProps = {
  activeTodoService: InjectionType<'IActiveTodoService'>;
};

export const TodoList = injectComponent<InjectedProps>(
  ({ activeTodoService }) => {
    const { data, isPending } = activeTodoService.getAll.useQuery();
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
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </ScrollArea.Autosize>
    );
  },
  appContainer,
  { activeTodoService: InjectionSymbol('IActiveTodoService') },
);
