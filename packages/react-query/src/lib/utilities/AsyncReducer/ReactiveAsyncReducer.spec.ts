import { DefineReactiveEagerAsync } from '@chimeric/core';
import { ReactiveAsyncReducer } from './ReactiveAsyncReducer';
import { AsyncReducerTestFixtures } from '../__tests__/asyncReducerFixtures';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ReactiveAsyncReducer', () => {
  it('should be defined', () => {
    expect(ReactiveAsyncReducer).toBeDefined();
  });

  // ==================== USAGE TESTS ====================
  describe('USAGE: REACTIVE', () => {
    describe('no params', () => {
      it('should aggregate sync services without params', () => {
        const { reactiveSync, fn } =
          AsyncReducerTestFixtures.sync.withoutParams.getReactive();

        const asyncReducer = ReactiveAsyncReducer().build({
          serviceList: [{ service: reactiveSync }],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() => asyncReducer.use());

        expect(result.current.data).toBe('sync-no-params');
        expect(result.current.isSuccess).toBe(true);
        expect(fn).toHaveBeenCalled();
      });

      it('should aggregate eagerAsync services without params', async () => {
        const { reactiveEagerAsync, fn } =
          AsyncReducerTestFixtures.eagerAsync.withoutParams.getReactive();

        const asyncReducer = ReactiveAsyncReducer().build({
          serviceList: [{ service: reactiveEagerAsync }],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() => asyncReducer.use());

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe('eager-no-params');
        expect(result.current.isSuccess).toBe(true);
        expect(fn).toHaveBeenCalled();
      });

      it('should aggregate query services without params', async () => {
        const { reactiveQuery, queryFn, queryClient } =
          AsyncReducerTestFixtures.query.withoutParams.getReactive();

        const asyncReducer = ReactiveAsyncReducer().build({
          serviceList: [{ service: reactiveQuery }],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() => asyncReducer.use(), {
          wrapper: getTestWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe('query-no-params');
        expect(result.current.isSuccess).toBe(true);
        expect(queryFn).toHaveBeenCalled();
      });

      it('should aggregate multiple services without params', async () => {
        const { reactiveSync, fn: syncFn } =
          AsyncReducerTestFixtures.sync.withoutParams.getReactive();
        const { reactiveEagerAsync, fn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withoutParams.getReactive();
        const { reactiveQuery, queryFn, queryClient } =
          AsyncReducerTestFixtures.query.withoutParams.getReactive();

        const asyncReducer = ReactiveAsyncReducer().build({
          serviceList: [
            { service: reactiveSync },
            { service: reactiveEagerAsync },
            { service: reactiveQuery },
          ],
          reducer: ([sync, eager, query]) => `${sync}:${eager}:${query}`,
        });

        const { result } = renderHook(() => asyncReducer.use(), {
          wrapper: getTestWrapper(queryClient),
        });

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe(
          'sync-no-params:eager-no-params:query-no-params',
        );
        expect(result.current.isSuccess).toBe(true);
        expect(syncFn).toHaveBeenCalled();
        expect(eagerFn).toHaveBeenCalled();
        expect(queryFn).toHaveBeenCalled();
      });
    });

    describe('with params', () => {
      it('should aggregate sync services with params', () => {
        const { reactiveSync, fn } =
          AsyncReducerTestFixtures.sync.withParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() =>
          asyncReducer.use({ value: 'test' }),
        );

        expect(result.current.data).toBe('sync-test');
        expect(result.current.isSuccess).toBe(true);
        expect(fn).toHaveBeenCalledWith({ value: 'test' }, undefined);
      });

      it('should aggregate eagerAsync services with params', async () => {
        const { reactiveEagerAsync, fn } =
          AsyncReducerTestFixtures.eagerAsync.withParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveEagerAsync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() =>
          asyncReducer.use({ value: 'test' }),
        );

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe('eager-test');
        expect(result.current.isSuccess).toBe(true);
        expect(fn).toHaveBeenCalledWith({ value: 'test' });
      });

      it('should aggregate query services with params', async () => {
        const { reactiveQuery, queryFn, queryClient } =
          AsyncReducerTestFixtures.query.withParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveQuery,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(
          () => asyncReducer.use({ value: 'test' }),
          {
            wrapper: getTestWrapper(queryClient),
          },
        );

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe('query-test');
        expect(result.current.isSuccess).toBe(true);
        expect(queryFn).toHaveBeenCalledWith({ value: 'test' });
      });

      it('should aggregate multiple services with params', async () => {
        const { reactiveSync, fn: syncFn } =
          AsyncReducerTestFixtures.sync.withParams.getReactive();
        const { reactiveEagerAsync, fn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withParams.getReactive();
        const { reactiveQuery, queryFn, queryClient } =
          AsyncReducerTestFixtures.query.withParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            { service: reactiveSync, getParams: (params: Params) => params },
            {
              service: reactiveEagerAsync,
              getParams: (params: Params) => params,
            },
            { service: reactiveQuery, getParams: (params: Params) => params },
          ],
          reducer: ([sync, eager, query]) => `${sync}:${eager}:${query}`,
        });

        const { result } = renderHook(
          () => asyncReducer.use({ value: 'test' }),
          {
            wrapper: getTestWrapper(queryClient),
          },
        );

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe('sync-test:eager-test:query-test');
        expect(result.current.isSuccess).toBe(true);
        expect(syncFn).toHaveBeenCalledWith({ value: 'test' }, undefined);
        expect(eagerFn).toHaveBeenCalledWith({ value: 'test' });
        expect(queryFn).toHaveBeenCalledWith({ value: 'test' });
      });
    });

    describe('with optional params', () => {
      it('should aggregate sync services with optional params (provided)', () => {
        const { reactiveSync, fn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() =>
          asyncReducer.use({ value: 'test' }),
        );

        expect(result.current.data).toBe('sync-test');
        expect(result.current.isSuccess).toBe(true);
        expect(fn).toHaveBeenCalledWith({ value: 'test' }, undefined);
      });

      it('should aggregate sync services with optional params (omitted)', () => {
        const { reactiveSync, fn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveSync,
              getParams: () => undefined,
            },
          ],
          reducer: ([result]) => result,
        });

        const { result } = renderHook(() =>
          asyncReducer.use({ value: 'test' }),
        );

        expect(result.current.data).toBe('sync-default');
        expect(result.current.isSuccess).toBe(true);
        expect(fn).toHaveBeenCalledWith(undefined, undefined);
      });

      it('should aggregate multiple services with mixed optional params', async () => {
        const { reactiveSync, fn: syncFn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getReactive();
        const { reactiveEagerAsync, fn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withOptionalParams.getReactive();
        const { reactiveQuery, queryFn, queryClient } =
          AsyncReducerTestFixtures.query.withOptionalParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            { service: reactiveSync, getParams: (params: Params) => params },
            { service: reactiveEagerAsync, getParams: () => undefined },
            { service: reactiveQuery, getParams: (params: Params) => params },
          ],
          reducer: ([sync, eager, query]) => `${sync}:${eager}:${query}`,
        });

        const { result } = renderHook(
          () => asyncReducer.use({ value: 'test' }),
          {
            wrapper: getTestWrapper(queryClient),
          },
        );

        await waitFor(() => {
          expect(result.current.isPending).toBe(false);
        });

        expect(result.current.data).toBe('sync-test:eager-default:query-test');
        expect(result.current.isSuccess).toBe(true);
        expect(syncFn).toHaveBeenCalledWith({ value: 'test' }, undefined);
        expect(eagerFn).toHaveBeenCalledWith(undefined);
        expect(queryFn).toHaveBeenCalledWith({ value: 'test' });
      });
    });
  });

  // ==================== TYPE ERROR TESTS ====================
  describe('TYPE ERRORS: REACTIVE', () => {
    describe('no params', () => {
      it('should error when providing params to no-param service', () => {
        const { reactiveSync } =
          AsyncReducerTestFixtures.sync.withoutParams.getReactive();

        const asyncReducer = ReactiveAsyncReducer().build({
          serviceList: [{ service: reactiveSync }],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Cannot provide params to no-param service
        renderHook(() => asyncReducer.use({ value: 'test' }));
      });
    });

    describe('with params', () => {
      it('should error when omitting required params', () => {
        const { reactiveSync } =
          AsyncReducerTestFixtures.sync.withParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Required params must be provided
        renderHook(() => asyncReducer.use());
      });

      it('should error when providing wrong param shape', () => {
        const { reactiveSync } =
          AsyncReducerTestFixtures.sync.withParams.getReactive();

        type Params = { value: string };
        const asyncReducer = ReactiveAsyncReducer<Params>().build({
          serviceList: [
            {
              service: reactiveSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Wrong param shape
        renderHook(() => asyncReducer.use({ wrongKey: 'test' }));
      });

      it('should error when getParams is omitted for required param service', () => {
        const { reactiveSync } =
          AsyncReducerTestFixtures.sync.withParams.getReactive();

        type Params = { value: string };
        ReactiveAsyncReducer<Params>().build({
          serviceList: [
            // @ts-expect-error - getParams is required for services with required params
            {
              service: reactiveSync,
            },
          ],
          reducer: ([result]) => result,
        });
      });
    });
  });

  // ==================== ANNOTATION TESTS ====================
  describe('ANNOTATIONS', () => {
    it('should match DefineReactiveEagerAsync type with no params', () => {
      const { reactiveSync, annotation: _syncAnnotation } =
        AsyncReducerTestFixtures.sync.withoutParams.getReactive();

      const asyncReducer = ReactiveAsyncReducer().build({
        serviceList: [{ service: reactiveSync }],
        reducer: ([result]) => result,
      });

      type Expected = DefineReactiveEagerAsync<() => Promise<string>>;
      const _annotation: Expected = asyncReducer;
      expect(_annotation).toBeDefined();
    });

    it('should match DefineReactiveEagerAsync type with params', () => {
      const { reactiveSync, annotation: _syncAnnotation } =
        AsyncReducerTestFixtures.sync.withParams.getReactive();

      type Params = { value: string };
      const asyncReducer = ReactiveAsyncReducer<Params>().build({
        serviceList: [
          {
            service: reactiveSync,
            getParams: (params: Params) => params,
          },
        ],
        reducer: ([result]) => result,
      });

      type Expected = DefineReactiveEagerAsync<
        (params: { value: string }) => Promise<string>
      >;
      const _annotation: Expected = asyncReducer;
      expect(_annotation).toBeDefined();
    });

    it('should match DefineReactiveEagerAsync type with optional params', () => {
      const { reactiveSync, annotation: _syncAnnotation } =
        AsyncReducerTestFixtures.sync.withOptionalParams.getReactive();

      type Params = { value: string };
      const asyncReducer = ReactiveAsyncReducer<Params>().build({
        serviceList: [
          {
            service: reactiveSync,
            getParams: (params: Params) => params,
          },
        ],
        reducer: ([result]) => result,
      });

      type Expected = DefineReactiveEagerAsync<
        (params: { value: string }) => Promise<string>
      >;
      const _annotation: Expected = asyncReducer;
      expect(_annotation).toBeDefined();
    });
  });
});
