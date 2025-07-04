import {
  Box,
  Button,
  Group,
  Loader,
  ScrollArea,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { format } from 'date-fns';
import { injectComponent } from 'src/utils/inversify/InjectComponent/DI';
import { useViewportSize } from '@mantine/hooks';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type InjectedProps = {
  reviewRepository: InjectionType<'IReviewRepository'>;
  startReviewUseCase: InjectionType<'StartReviewUseCase'>;
  finishReviewUseCase: InjectionType<'FinishReviewUseCase'>;
  getTodosUnderReviewUseCase: InjectionType<'GetTodosUnderReviewUseCase'>;
};

export const ReviewContent = injectComponent<InjectedProps>(
  {
    reviewRepository: InjectionSymbol('IReviewRepository'),
    startReviewUseCase: InjectionSymbol('StartReviewUseCase'),
    finishReviewUseCase: InjectionSymbol('FinishReviewUseCase'),
    getTodosUnderReviewUseCase: InjectionSymbol('GetTodosUnderReviewUseCase'),
  },
  ({
    reviewRepository,
    startReviewUseCase,
    finishReviewUseCase,
    getTodosUnderReviewUseCase,
  }) => {
    const review = reviewRepository.get.useSync();
    const hasStartedReview = Boolean(review);
    const startReview = startReviewUseCase.execute.useAsync();
    const todosUnderReview = getTodosUnderReviewUseCase.execute.useEagerAsync();
    const { height } = useViewportSize();

    return (
      <Box>
        <Group justify="space-between" align="center" h="60px">
          <Title order={1}>Review Todos</Title>
          {hasStartedReview ? (
            <Button onClick={() => finishReviewUseCase.execute()}>
              Finish Review
            </Button>
          ) : (
            <Button onClick={() => startReview.invoke()}>Start Review</Button>
          )}
        </Group>
        <Space h="lg" />
        {startReview.isPending || todosUnderReview.isPending ? (
          <Loader />
        ) : (
          <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
            {todosUnderReview.data?.map((todo) => (
              <Box key={todo.id}>
                <Title order={4}>{todo.title}</Title>
                <Text size="sm">{`Created At: ${format(todo.createdAt, 'M/d/yyyy h:m aaa')}`}</Text>
              </Box>
            ))}
          </ScrollArea.Autosize>
        )}
      </Box>
    );
  },
);
