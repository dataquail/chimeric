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
import { useViewportSize } from '@mantine/hooks';
import { container } from 'src/core/global/container';

export const ReviewContent = () => {
  const {
    reviewRepository,
    startReviewUseCase,
    finishReviewUseCase,
    getTodosUnderReviewUseCase,
  } = container;

  const review = reviewRepository.get.useHook();
  const hasStartedReview = Boolean(review);
  const startReview = startReviewUseCase.execute.useHook();
  const todosUnderReview = getTodosUnderReviewUseCase.execute.useHook();
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
};
