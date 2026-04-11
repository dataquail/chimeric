## 2.0.3 (2026-04-11)

### 🩹 Fixes

- remove NX Cloud to unblock CI pipeline ([8de6436](https://github.com/dataquail/chimeric/commit/8de6436))

### ❤️ Thank You

- Claude Sonnet 4.6
- Zachary Weidenbach @zacharyweidenbach

## 2.0.2 (2026-04-10)

### 🩹 Fixes

- **deps:** patch all 19 high severity CVEs via overrides and dependency bumps ([e80ba4a](https://github.com/dataquail/chimeric/commit/e80ba4a))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 2.0.1 (2026-04-10)

### 🩹 Fixes

- **ci:** use pull_request_target for dependabot auto-merge workflow ([899efcf](https://github.com/dataquail/chimeric/commit/899efcf))
- **ci:** use rebase merge strategy for dependabot auto-merge ([1efcfbc](https://github.com/dataquail/chimeric/commit/1efcfbc))
- **deps:** patch critical CVEs in axios and form-data transitive deps ([40243e7](https://github.com/dataquail/chimeric/commit/40243e7))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

# 2.0.0 (2026-04-09)

### 🚀 Features

- improve testing for reducers ([fbd13b5](https://github.com/dataquail/chimeric/commit/fbd13b5))
- ⚠️  rename all hooks from `use` to `useHook` for React compiler compatibility ([3d5e12e](https://github.com/dataquail/chimeric/commit/3d5e12e))
- ⚠️  remove testing packages and refactor examples to idiomatic-only tests ([d2c27a5](https://github.com/dataquail/chimeric/commit/d2c27a5))
- ⚠️  replace MSW browser runtime with todo-api express server ([0179245](https://github.com/dataquail/chimeric/commit/0179245))
- ⚠️  add prefetch support to chimeric queries ([9ba401a](https://github.com/dataquail/chimeric/commit/9ba401a))
- ⚠️  add prefetch support to chimeric infinite queries ([e5e0fc2](https://github.com/dataquail/chimeric/commit/e5e0fc2))
- ⚠️  add useSuspenseHook to chimeric queries via useSuspenseQuery ([675f0b3](https://github.com/dataquail/chimeric/commit/675f0b3))
- ⚠️  add react-server export conditions for isomorphic chimeric usage ([ed6ca4f](https://github.com/dataquail/chimeric/commit/ed6ca4f))
- ⚠️  remove QueryWithManagedStore, replace with PriorityTodoRepository pattern ([c41e881](https://github.com/dataquail/chimeric/commit/c41e881))
- ⚠️  add @chimeric/rtk-query package with RTK Query integration and redux-todo-app example ([155e71f](https://github.com/dataquail/chimeric/commit/155e71f))
- ⚠️  replace SavedForLaterTodos with ArchivedTodos, add useSuspenseHook to InfiniteQuery ([2fc743e](https://github.com/dataquail/chimeric/commit/2fc743e))
- ⚠️  upgrade @tanstack/react-query to ^5.96.2, expose MutationFunctionContext ([a56f860](https://github.com/dataquail/chimeric/commit/a56f860))
- add behavior-driven integration tests, fix rtk-query void-params options routing ([73b0413](https://github.com/dataquail/chimeric/commit/73b0413))
- ⚠️  add documentation site and relocate SyncReducer to @chimeric/react ([9a1570e](https://github.com/dataquail/chimeric/commit/9a1570e))

### 🩹 Fixes

- sync pnpm-lock.yaml with package.json dependency changes ([1001e32](https://github.com/dataquail/chimeric/commit/1001e32))

### ⚠️  Breaking Changes

- SyncReducer (ChimericSyncReducer, IdiomaticSyncReducer,
- mutationFn now receives a second MutationFunctionContext
- ⚠️  replace SavedForLaterTodos with ArchivedTodos, add useSuspenseHook to InfiniteQuery ([2fc743e](https://github.com/dataquail/chimeric/commit/2fc743e))
- ⚠️  add @chimeric/rtk-query package with RTK Query integration and redux-todo-app example ([155e71f](https://github.com/dataquail/chimeric/commit/155e71f))
- ChimericQueryWithManagedStoreFactory,
- ⚠️  add react-server export conditions for isomorphic chimeric usage ([ed6ca4f](https://github.com/dataquail/chimeric/commit/ed6ca4f))
- ReactiveQuery and ChimericQuery types now include
- `createIdiomaticInfiniteQuery` and
- `createIdiomaticQuery` and `createReactiveQuery` now
- basic-todo-app and todo-app now require the todo-api
- @chimeric/testing-core, @chimeric/testing-react, and
- All `.use()` calls on chimeric interfaces must be updated to `.useHook()`.

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 1.1.0 (2025-10-17)

### 🚀 Features

- implement infinite queries ([e0694a2](https://github.com/dataquail/chimeric/commit/e0694a2))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

# 1.0.0 (2025-10-14)

### 🚀 Features

- queries handle arbitrary arguments ([ce18829](https://github.com/dataquail/chimeric/commit/ce18829))
- sync core and reducer arg refactor ([e483451](https://github.com/dataquail/chimeric/commit/e483451))
- revise sync and async reducers for sync ([5817035](https://github.com/dataquail/chimeric/commit/5817035))
- sync test harness refactor ([8677b61](https://github.com/dataquail/chimeric/commit/8677b61))
- cleanup lint errors ([c97e75a](https://github.com/dataquail/chimeric/commit/c97e75a))
- mutation ([6a8b099](https://github.com/dataquail/chimeric/commit/6a8b099))
- async refactor ([f69299d](https://github.com/dataquail/chimeric/commit/f69299d))
- eager async refactor ([73e41ab](https://github.com/dataquail/chimeric/commit/73e41ab))
- ⚠️  async reducer cleanup - arg refactor ([3c4f3db](https://github.com/dataquail/chimeric/commit/3c4f3db))

### ⚠️  Breaking Changes

- ⚠️  async reducer cleanup - arg refactor ([3c4f3db](https://github.com/dataquail/chimeric/commit/3c4f3db))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 0.4.0 (2025-09-25)

### 🚀 Features

- rename all hooks to 'use' ([847c908](https://github.com/dataquail/chimeric/commit/847c908))
- 'use' for hooks, reducers ([4e464f6](https://github.com/dataquail/chimeric/commit/4e464f6))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 0.3.0 (2025-07-05)

### 🚀 Features

- change 'call' to 'invoke' ([51e08fe](https://github.com/dataquail/chimeric/commit/51e08fe))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 0.2.15 (2025-07-04)

### 🩹 Fixes

- async types simplified ([8fe5149](https://github.com/dataquail/chimeric/commit/8fe5149))
- simplify sync types ([68c6b81](https://github.com/dataquail/chimeric/commit/68c6b81))
- simplify types for eager async ([62dfa8d](https://github.com/dataquail/chimeric/commit/62dfa8d))
- simplify mutation types ([dda9b0f](https://github.com/dataquail/chimeric/commit/dda9b0f))
- simplify query types ([89b7343](https://github.com/dataquail/chimeric/commit/89b7343))
- simplify async types more ([f1fe524](https://github.com/dataquail/chimeric/commit/f1fe524))
- simplify eagerAsync types ([2165d33](https://github.com/dataquail/chimeric/commit/2165d33))
- refine sync types ([ea09d38](https://github.com/dataquail/chimeric/commit/ea09d38))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 0.2.14 (2025-06-12)

### 🩹 Fixes

- no undefined return type on eagerAsync ([53ba7ec](https://github.com/dataquail/chimeric/commit/53ba7ec))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 0.2.13 (2025-06-11)

### 🩹 Fixes

- update readme with better examples ([77ac262](https://github.com/dataquail/chimeric/commit/77ac262))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach

## 0.2.12 (2025-06-11)

### 🩹 Fixes

- readmes and keywords ([25b8f09](https://github.com/dataquail/chimeric/commit/25b8f09))

### ❤️ Thank You

- Zachary Weidenbach @zacharyweidenbach
