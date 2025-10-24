import { DefineIdiomaticEagerAsync } from '@chimeric/core';
import { IdiomaticAsyncReducer } from './IdiomaticAsyncReducer';
import { AsyncReducerTestFixtures } from '../__tests__/asyncReducerFixtures';

describe('IdiomaticAsyncReducer', () => {
  it('should be defined', () => {
    expect(IdiomaticAsyncReducer).toBeDefined();
  });

  // ==================== USAGE TESTS ====================
  describe('USAGE', () => {
    describe('no params', () => {
      it('should aggregate sync services without params', async () => {
        const { idiomaticSync, fn } =
          AsyncReducerTestFixtures.sync.withoutParams.getIdiomatic();

        const asyncReducer = IdiomaticAsyncReducer().build({
          serviceList: [{ service: idiomaticSync }],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer();
        expect(result).toBe('sync-no-params');
        expect(fn).toHaveBeenCalled();
      });

      it('should aggregate eagerAsync services without params', async () => {
        const { idiomaticEagerAsync, fn } =
          AsyncReducerTestFixtures.eagerAsync.withoutParams.getIdiomatic();

        const asyncReducer = IdiomaticAsyncReducer().build({
          serviceList: [{ service: idiomaticEagerAsync }],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer();
        expect(result).toBe('eager-no-params');
        expect(fn).toHaveBeenCalled();
      });

      it('should aggregate query services without params', async () => {
        const { idiomaticQuery, queryFn } =
          AsyncReducerTestFixtures.query.withoutParams.getIdiomatic();

        const asyncReducer = IdiomaticAsyncReducer().build({
          serviceList: [{ service: idiomaticQuery }],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer();
        expect(result).toBe('query-no-params');
        expect(queryFn).toHaveBeenCalled();
      });

      it('should aggregate multiple services without params', async () => {
        const { idiomaticSync, fn: syncFn } =
          AsyncReducerTestFixtures.sync.withoutParams.getIdiomatic();
        const { idiomaticEagerAsync, fn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withoutParams.getIdiomatic();
        const { idiomaticQuery, queryFn } =
          AsyncReducerTestFixtures.query.withoutParams.getIdiomatic();

        const asyncReducer = IdiomaticAsyncReducer().build({
          serviceList: [
            { service: idiomaticSync },
            { service: idiomaticEagerAsync },
            { service: idiomaticQuery },
          ],
          reducer: ([sync, eager, query]) => `${sync}:${eager}:${query}`,
        });

        const result = await asyncReducer();
        expect(result).toBe('sync-no-params:eager-no-params:query-no-params');
        expect(syncFn).toHaveBeenCalled();
        expect(eagerFn).toHaveBeenCalled();
        expect(queryFn).toHaveBeenCalled();
      });
    });

    describe('with params', () => {
      it('should aggregate sync services with params', async () => {
        const { idiomaticSync, fn } =
          AsyncReducerTestFixtures.sync.withParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('sync-test');
        expect(fn).toHaveBeenCalledWith({ value: 'test' }, undefined);
      });

      it('should aggregate eagerAsync services with params', async () => {
        const { idiomaticEagerAsync, fn } =
          AsyncReducerTestFixtures.eagerAsync.withParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticEagerAsync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('eager-test');
        expect(fn).toHaveBeenCalledWith({ value: 'test' });
      });

      it('should aggregate query services with params', async () => {
        const { idiomaticQuery, queryFn } =
          AsyncReducerTestFixtures.query.withParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticQuery,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('query-test');
        expect(queryFn).toHaveBeenCalledWith({ value: 'test' });
      });

      it('should aggregate multiple services with params', async () => {
        const { idiomaticSync, fn: syncFn } =
          AsyncReducerTestFixtures.sync.withParams.getIdiomatic();
        const { idiomaticEagerAsync, fn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withParams.getIdiomatic();
        const { idiomaticQuery, queryFn } =
          AsyncReducerTestFixtures.query.withParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            { service: idiomaticSync, getParams: (params: Params) => params },
            {
              service: idiomaticEagerAsync,
              getParams: (params: Params) => params,
            },
            { service: idiomaticQuery, getParams: (params: Params) => params },
          ],
          reducer: ([sync, eager, query]) => `${sync}:${eager}:${query}`,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('sync-test:eager-test:query-test');
        expect(syncFn).toHaveBeenCalledWith({ value: 'test' }, undefined);
        expect(eagerFn).toHaveBeenCalledWith({ value: 'test' });
        expect(queryFn).toHaveBeenCalledWith({ value: 'test' });
      });
    });

    describe('with optional params', () => {
      it('should aggregate sync services with optional params (provided)', async () => {
        const { idiomaticSync, fn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('sync-test');
        expect(fn).toHaveBeenCalledWith({ value: 'test' }, undefined);
      });

      it('should aggregate sync services with optional params (omitted)', async () => {
        const { idiomaticSync, fn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticSync,
              getParams: () => undefined,
            },
          ],
          reducer: ([result]) => result,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('sync-default');
        expect(fn).toHaveBeenCalledWith(undefined, undefined);
      });

      it('should aggregate multiple services with mixed optional params', async () => {
        const { idiomaticSync, fn: syncFn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getIdiomatic();
        const { idiomaticEagerAsync, fn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withOptionalParams.getIdiomatic();
        const { idiomaticQuery, queryFn } =
          AsyncReducerTestFixtures.query.withOptionalParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            { service: idiomaticSync, getParams: (params: Params) => params },
            { service: idiomaticEagerAsync, getParams: () => undefined },
            { service: idiomaticQuery, getParams: (params: Params) => params },
          ],
          reducer: ([sync, eager, query]) => `${sync}:${eager}:${query}`,
        });

        const result = await asyncReducer({ value: 'test' });
        expect(result).toBe('sync-test:eager-default:query-test');
        expect(syncFn).toHaveBeenCalledWith({ value: 'test' }, undefined);
        expect(eagerFn).toHaveBeenCalledWith(undefined);
        expect(queryFn).toHaveBeenCalledWith({ value: 'test' });
      });
    });
  });

  // ==================== TYPE ERROR TESTS ====================
  describe('TYPE ERRORS', () => {
    describe('no params', () => {
      it('should error when providing params to no-param service', () => {
        const { idiomaticSync } =
          AsyncReducerTestFixtures.sync.withoutParams.getIdiomatic();

        const asyncReducer = IdiomaticAsyncReducer().build({
          serviceList: [{ service: idiomaticSync }],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Cannot provide params to no-param service
        asyncReducer({ value: 'test' });
      });
    });

    describe('with params', () => {
      it('should error when omitting required params', () => {
        const { idiomaticSync } =
          AsyncReducerTestFixtures.sync.withParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Required params must be provided
        asyncReducer();
      });

      it('should error when providing wrong param shape', () => {
        const { idiomaticSync } =
          AsyncReducerTestFixtures.sync.withParams.getIdiomatic();

        type Params = { value: string };
        const asyncReducer = IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            {
              service: idiomaticSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Wrong param shape
        asyncReducer({ wrongKey: 'test' });
      });

      it('should error when getParams is omitted for required param service', () => {
        const { idiomaticSync } =
          AsyncReducerTestFixtures.sync.withParams.getIdiomatic();

        type Params = { value: string };
        IdiomaticAsyncReducer<Params>().build({
          serviceList: [
            // @ts-expect-error - getParams is required for services with required params
            {
              service: idiomaticSync,
            },
          ],
          reducer: ([result]) => result,
        });
      });
    });
  });

  // ==================== ANNOTATION TESTS ====================
  describe('ANNOTATIONS', () => {
    it('should match DefineIdiomaticEagerAsync type with no params', () => {
      const { idiomaticSync, annotation: _syncAnnotation } =
        AsyncReducerTestFixtures.sync.withoutParams.getIdiomatic();

      const asyncReducer = IdiomaticAsyncReducer().build({
        serviceList: [{ service: idiomaticSync }],
        reducer: ([result]) => result,
      });

      type Expected = DefineIdiomaticEagerAsync<() => Promise<string>>;
      const _annotation: Expected = asyncReducer;
      expect(_annotation).toBeDefined();
    });

    it('should match DefineIdiomaticEagerAsync type with params', () => {
      const { idiomaticSync, annotation: _syncAnnotation } =
        AsyncReducerTestFixtures.sync.withParams.getIdiomatic();

      type Params = { value: string };
      const asyncReducer = IdiomaticAsyncReducer<Params>().build({
        serviceList: [
          {
            service: idiomaticSync,
            getParams: (params: Params) => params,
          },
        ],
        reducer: ([result]) => result,
      });

      type Expected = DefineIdiomaticEagerAsync<
        (params: { value: string }) => Promise<string>
      >;
      const _annotation: Expected = asyncReducer;
      expect(_annotation).toBeDefined();
    });

    it('should match DefineIdiomaticEagerAsync type with optional params', () => {
      const { idiomaticSync, annotation: _syncAnnotation } =
        AsyncReducerTestFixtures.sync.withOptionalParams.getIdiomatic();

      type Params = { value: string };
      const asyncReducer = IdiomaticAsyncReducer<Params>().build({
        serviceList: [
          {
            service: idiomaticSync,
            getParams: (params: Params) => params,
          },
        ],
        reducer: ([result]) => result,
      });

      type Expected = DefineIdiomaticEagerAsync<
        (params: { value: string }) => Promise<string>
      >;
      const _annotation: Expected = asyncReducer;
      expect(_annotation).toBeDefined();
    });
  });
});
