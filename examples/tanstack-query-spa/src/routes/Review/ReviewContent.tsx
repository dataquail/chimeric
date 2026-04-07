import {
  Box,
  Button,
  Checkbox,
  Group,
  Loader,
  ScrollArea,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { format } from 'date-fns';
import { useViewportSize } from '@mantine/hooks';
import { reviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository';
import { startReviewUseCase } from 'src/core/useCases/review/application/startReviewUseCase';
import { getTodosUnderReviewUseCase } from 'src/core/useCases/review/application/getTodosUnderReviewUseCase';
import { finishReviewUseCase } from 'src/core/useCases/review/application/finishReviewUseCase';
import { activeTodoService } from 'src/core/infrastructure/services/ActiveTodoService';
import { TodoUnderReview } from 'src/core/domain/review/viewModels/out/TodoUnderReview';

const TodoUnderReviewCard = ({ todo }: { todo: TodoUnderReview }) => {
  const uncompleteOne = activeTodoService.uncompleteOne.useHook();
  const isExempted = !todo.completedAt;

  return (
    <Box p="xs" pr="lg">
      <Group wrap="nowrap" align="flex-start">
        <Checkbox.Card
          radius="md"
          checked={!isExempted}
          disabled={uncompleteOne.isPending}
          onClick={() => {
            if (!isExempted) {
              uncompleteOne.invoke({ id: todo.id });
            }
          }}
        >
          <Group wrap="nowrap" align="flex-start">
            {uncompleteOne.isPending ? (
              <Loader p="xs" />
            ) : (
              <Checkbox.Indicator mt="sm" ml="sm" />
            )}
            <Stack p="xs" align="stretch" gap="xs">
              <Title order={4} c={isExempted ? 'dimmed' : undefined}>
                {todo.title}
              </Title>
              <Text size="sm">{`Created At: ${format(
                todo.createdAt,
                'M/d/yyyy h:m aaa',
              )}`}</Text>
              {isExempted && (
                <Text size="sm" c="dimmed" fs="italic">
                  Uncompleted — will not be archived
                </Text>
              )}
            </Stack>
          </Group>
        </Checkbox.Card>
      </Group>
    </Box>
  );
};

export const ReviewContent = () => {
  const review = reviewRepository.get.useHook();
  const hasStartedReview = Boolean(review);
  const startReview = startReviewUseCase.useHook();
  const finishReview = finishReviewUseCase.useHook();
  const todosUnderReview = getTodosUnderReviewUseCase.useHook();
  const { height } = useViewportSize();

  return (
    <Box>
      <Group justify="space-between" align="center" h="60px">
        <Title order={1}>Review Completed Todos</Title>
        {hasStartedReview ? (
          <Button
            onClick={() => finishReview.invoke()}
            loading={finishReview.isPending}
          >
            Archive & Finish
          </Button>
        ) : (
          <Button
            onClick={() => startReview.invoke()}
            loading={startReview.isPending}
          >
            Start Review
          </Button>
        )}
      </Group>
      <Space h="lg" />
      {!hasStartedReview && (
        <Text c="dimmed">
          Start a review to see all completed todos. Uncheck any you want to
          keep active. The rest will be archived when you finish.
        </Text>
      )}
      {startReview.isPending || todosUnderReview.isPending ? (
        <Loader />
      ) : (
        <ScrollArea.Autosize mah={`calc(${height}px - 172px`}>
          {todosUnderReview.data?.map((todo) => (
            <TodoUnderReviewCard key={todo.id} todo={todo} />
          ))}
        </ScrollArea.Autosize>
      )}
    </Box>
  );
};
