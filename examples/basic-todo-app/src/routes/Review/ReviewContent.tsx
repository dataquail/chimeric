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
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { startReviewUseCase } from 'src/core/useCases/review/application/startReviewUseCase';
import { getTodosUnderReviewUseCase } from 'src/core/useCases/review/application/getTodosUnderReviewUseCase';
import { finishReviewUseCase } from 'src/core/useCases/review/application/finishReviewUseCase';

export const ReviewContent = () => {
  const review = reviewRepository.get.use();
  const hasStartedReview = Boolean(review);
  const startReview = startReviewUseCase.use();
  const todosUnderReview = getTodosUnderReviewUseCase.use();
  const { height } = useViewportSize();

  return (
    <Box>
      <Group justify="space-between" align="center" h="60px">
        <Title order={1}>Review Todos</Title>
        {hasStartedReview ? (
          <Button onClick={() => finishReviewUseCase()}>Finish Review</Button>
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
