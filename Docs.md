# Chimeric

## Foreward

Interfaces are useful for hiding complexity. Idiomatic code is better than non-idiomatic code for orchestrating complex operations across many interfaces. React Hooks are non-idiomatic code. Therefore, interfaces implemented with React Hooks necessarily prohibit idiomatic orchestration.

React Hooks are convenient for simple use-cases. The best of both worlds would be interfaces that could be used non-idiomatically as React Hooks for simple use-cases, but also idiomatically, when complexity increases sufficiently to warrant it.

## What is it?

Chimeric is an interface library for React. A “Chimeric Interface” is one that contains both a an idiomatic function that can be called like any other function in JS/TS. But it also contains a reactive function (a hook) that can be called within React components and hooks. This duality inspired the name of the library. The end result is a signature that looks like this:

```ts
// idiomatic
const todos = getTodos();

// reactively within a React component/hook
const todos = getTodos.use();
```

## Why is it?

React hooks can implement interfaces, and this can take you far. But orchestration can become difficult if reactive data sources are involved, and coupling to external libraries can be high. Consider the following example using Redux:

```ts
const useMarkAllTodosCompleteAndStartReview = () => {
  const todos = useTodos();
  const todoReview = useTodoReview();
  const dispatch = useDispatch();

  return () => {
    dispatch(todosMarkedAsComplete());
    const completedTodos = todos.filter((todo) => Boolean(todo.completedAt));
    dispatch(reviewStarted(completedTodos));
  };
};
```

Notice the bug? `completedTodos` is filtering on the `todos`, which is a stale value after being mutated by `dispatch(todosMarkedAsComplete());` This is because `todos` won’t be recalculated until `useMarkAllTodosCompleteAndStartReview` is re-rendered. One fix is to imperatively refetch the value from the store.

```ts
const useMarkAllTodosCompleteAndStartReview = () => {
  const dispatch = useDispatch();
  const store = useStore();

  return () => {
    dispatch(todosMarkedAsComplete());
    const todos = store.getState().todo.list;
    const completedTodos =
      todos.filter((todo) => Boolean(todo.completedAt)) || [];
    dispatch(reviewStarted(completedTodos));
  };
};
```

Alternatively for orchestration, Redux recommends thunks.

```ts
const markAllTodosCompleteAndStartReview = (dispatch, getState) => {
  dispatch(todosMarkedAsComplete());
  const todos = getState().todo.list;
  const completedTodos = todos.filter(todo => Boolean(todo.completedAt)) || [];
  dispatch(reviewStarted(completedTodos));
}
…
dispatch(markAllTodosCompleteAndStartReview);
```

Both approaches are tightly coupled to redux. Let’s list out how:

1. The logic for how all todos are marked as complete is tightly coupled inside the redux reducer for that particular slice.
2. Both approaches use the `store` and `dispatch` directly.
3. Though not shown, there would typically be some UI component that reads the data out of redux via `const todos = useSelector(state => state.todos.list);` Now there are two ways to get things from the store: the reactive way (using `useSelector`) and the idiomatic way (using `store.getState()`).
4. The second approach is tightly coupled to redux’s implementation of thunks.

Migrating away from redux in either example would be costly. A technique to mitigate this would be to abstract interactions with the store behind a couple interfaces.

```tsx
const IdiomaticTodoService = (store) => {
  return {
    getTodos: () => store.getState().todo.list,
  };
};

const ReactiveTodoService = {
  useGetTodos: () => useSelector((state) => state.todo.list),
};

const useMarkAllTodosCompleteAndStartReview = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const todoService = IdiomaticTodoService(store);
  return () => {
    dispatch(todosMarkedAsComplete());
    const todos = todoService.getTodos();
    const completedTodos =
      todos.filter((todo) => Boolean(todo.completedAt)) || [];
    dispatch(reviewStarted(completedTodos));
  };
};

const TodoList = () => {
  const todos = ReactiveTodoService.useGetTodos();
  const markAllTodosCompleteAndStartReview =
    useMarkAllTodosCompleteAndStartReview();
  return (
    <div>
      <button onClick={() => markAllTodosCompleteAndStartReview()}>
        Mark all todos complete and start review
      </button>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  );
};
```

This decouples data access better, but the two different mechanisms for accessing the store are fairly disconnected from each other (`TodoService` and `useTodoService`). They appear as separate interfaces though they are two sides of the same coin (the idiomatic and reactive paths). They are highly cohesive. They could be combined in a different way.

```tsx
const TodoService = (store) => {
  return {
    getTodos: () => store.getState().todo.list,
    useGetTodos: () => useSelector((state) => state.todo.list),
  };
};

// Dependency injection hook
const useTodoService = () => {
  const store = useStore();
  return TodoService(store);
};

const useMarkAllTodosCompleteAndStartReview = () => {
  const dispatch = useDispatch();
  const todoService = useTodoService();
  return () => {
    dispatch(todosMarkedAsComplete());
    const todos = todoService.getTodos();
    const completedTodos =
      todos.filter((todo) => Boolean(todo.completedAt)) || [];
    dispatch(reviewStarted(completedTodos));
  };
};

const TodoList = () => {
  const todoService = useTodoService();
  const todos = todoService.useGetTodos();
  const markAllTodosCompleteAndStartReview =
    useMarkAllTodosCompleteAndStartReview();
  return (
    <div>
      <button onClick={() => markAllTodosCompleteAndStartReview()}>
        Complete All And Review
      </button>
      {todos.map((todo) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  );
};
```

The `TodoService` now colocates both paths to retrieve the data. Tight coupling to `dispatch` remains in the `markAllTodosCompleteAndStartReview`, and more could be done to abstract that but this illustrates the basic premise. The `TodoService` is _chimeric_. It has an idiomatic and reactive path for performing the same operation, in this case getting the todo list. It abstracts the details for how the list of todos are retrieved for both react components, and for idiomatic control flows.

## When should I use Chimeric?

1. If you have a lot of complexity/orchestration that you want to model idiomatically, as top-down functions.
2. If you want to abstract implementation details behind interfaces to hide complexity, improve modularity, isolate third party dependencies, and make things easier to test.
3. If you want a more layered architecture to scale with complexity. Chimeric can be adapted to follow MVC or MVVM architecture, though it is not opinionated about which kind of architecture.

The operative word is complexity. Chimeric interfaces have consequences to be aware of:

1. More indirection. All interface abstractions have this consequence.
2. Double the testing footprint. There a two ways to do something, and two paths that must be tested. Chimeric comes with a testing suite to address this.
3. Chimeric becomes a middleman between the libraries you normally use directly (tanstack query and RTK-query). Chimeric allows for arguments to be passed through to these libraries to alleviate this.

## Kinds of Chimerics

There are 5 basic kinds of chimeric interfaces:

1. `ChimericSync` - a synchronous operation, such as reading a value out of a reactive in-memory store.
2. `ChimericAsync` - an asynchronous operation.
3. `ChimericEagerAsync` - a variation of `ChimericAsync` but the promise is invoked on mount of the component using the hook.
4. `ChimericQuery` - an asynchronous operation that caches the result of the promise, and returns the cached value on subsequent calls.
5. `ChimericMutation` - an asynchronous operation that invalidations the result of one or many `ChimericQuery` caches.

From these kinds, all interfaces are built. `ChimericSync` and `ChimericAsync` are the most general-purpose.
