import { DefineChimericEagerAsync } from '@chimeric/core';
import { ChimericAsyncReducer } from './ChimericAsyncReducer.server';
import { AsyncReducerTestFixtures } from '../__tests__/asyncReducerFixtures';

describe('ChimericAsyncReducerServer', () => {
  it('should be defined', () => {
    expect(ChimericAsyncReducer).toBeDefined();
  });

  // ==================== USAGE TESTS: IDIOMATIC ====================
  describe('USAGE: IDIOMATIC', () => {
    describe('no params', () => {
      it('should aggregate multiple chimeric services without params', async () => {
        const { chimericSync, idiomaticFn: syncFn } =
          AsyncReducerTestFixtures.sync.withoutParams.getChimeric();
        const { chimericEagerAsync, idiomaticFn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withoutParams.getChimeric();
        const { chimericQuery, queryFn } =
          AsyncReducerTestFixtures.query.withoutParams.getChimeric();

        const asyncReducer = ChimericAsyncReducer().build({
          serviceList: [
            { service: chimericSync },
            { service: chimericEagerAsync },
            { service: chimericQuery },
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
      it('should aggregate multiple chimeric services with params', async () => {
        const { chimericSync, idiomaticFn: syncFn } =
          AsyncReducerTestFixtures.sync.withParams.getChimeric();
        const { chimericEagerAsync, idiomaticFn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withParams.getChimeric();
        const { chimericQuery, queryFn } =
          AsyncReducerTestFixtures.query.withParams.getChimeric();

        type Params = { value: string };
        const asyncReducer = ChimericAsyncReducer<Params>().build({
          serviceList: [
            { service: chimericSync, getParams: (params: Params) => params },
            {
              service: chimericEagerAsync,
              getParams: (params: Params) => params,
            },
            { service: chimericQuery, getParams: (params: Params) => params },
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
      it('should aggregate multiple chimeric services with mixed optional params', async () => {
        const { chimericSync, idiomaticFn: syncFn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getChimeric();
        const { chimericEagerAsync, idiomaticFn: eagerFn } =
          AsyncReducerTestFixtures.eagerAsync.withOptionalParams.getChimeric();
        const { chimericQuery, queryFn } =
          AsyncReducerTestFixtures.query.withOptionalParams.getChimeric();

        type Params = { value: string };
        const asyncReducer = ChimericAsyncReducer<Params>().build({
          serviceList: [
            { service: chimericSync, getParams: (params: Params) => params },
            { service: chimericEagerAsync },
            { service: chimericQuery, getParams: (params: Params) => params },
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

  // ==================== SERVER ERRORS ====================
  describe('SERVER ERRORS', () => {
    it('useHook throws', () => {
      const { chimericSync } =
        AsyncReducerTestFixtures.sync.withoutParams.getChimeric();

      const asyncReducer = ChimericAsyncReducer().build({
        serviceList: [{ service: chimericSync }],
        reducer: ([result]) => result,
      });

      expect(() => asyncReducer.useHook()).toThrow(
        "@chimeric/react-query: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
      );
    });
  });

  // ==================== TYPE ERROR TESTS ====================
  describe('TYPE ERRORS: IDIOMATIC', () => {
    describe('no params', () => {
      it('should error when providing params to no-param service', async () => {
        const { chimericSync } =
          AsyncReducerTestFixtures.sync.withoutParams.getChimeric();

        const asyncReducer = ChimericAsyncReducer().build({
          serviceList: [{ service: chimericSync }],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Cannot provide params to no-param service
        await asyncReducer({ value: 'test' });
      });
    });

    describe('with params', () => {
      it('should error when omitting required params', async () => {
        const { chimericSync } =
          AsyncReducerTestFixtures.sync.withParams.getChimeric();

        type Params = { value: string };
        const asyncReducer = ChimericAsyncReducer<Params>().build({
          serviceList: [
            {
              service: chimericSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Required params must be provided
        await asyncReducer();
      });

      it('should error when providing wrong param shape', async () => {
        const { chimericSync } =
          AsyncReducerTestFixtures.sync.withParams.getChimeric();

        type Params = { value: string };
        const asyncReducer = ChimericAsyncReducer<Params>().build({
          serviceList: [
            {
              service: chimericSync,
              getParams: (params: Params) => params,
            },
          ],
          reducer: ([result]) => result,
        });

        // @ts-expect-error - Wrong param shape
        await asyncReducer({ wrongKey: 'test' });
      });
    });
  });

  // ==================== ANNOTATION TESTS ====================
  describe('ANNOTATIONS', () => {
    it('should match DefineChimericEagerAsync type with no params', () => {
      const { chimericSync } =
        AsyncReducerTestFixtures.sync.withoutParams.getChimeric();

      type Expected = DefineChimericEagerAsync<() => Promise<string>>;
      const asyncReducer: Expected = ChimericAsyncReducer().build({
        serviceList: [{ service: chimericSync }],
        reducer: ([result]) => result,
      });

      expect(asyncReducer).toBeDefined();
    });

    it('should match DefineChimericEagerAsync type with params', () => {
      const { chimericSync } =
        AsyncReducerTestFixtures.sync.withParams.getChimeric();

      type Expected = DefineChimericEagerAsync<
        (params: { value: string }) => Promise<string>
      >;
      type Params = { value: string };
      const asyncReducer: Expected = ChimericAsyncReducer<Params>().build({
        serviceList: [
          {
            service: chimericSync,
            getParams: (params: Params) => params,
          },
        ],
        reducer: ([result]) => result,
      });

      expect(asyncReducer).toBeDefined();
    });

    it('should match DefineChimericEagerAsync type with optional params', () => {
      const { chimericSync } =
        AsyncReducerTestFixtures.sync.withOptionalParams.getChimeric();

      type Expected = DefineChimericEagerAsync<
        (params?: { value: string }) => Promise<string>
      >;
      type Params = { value: string } | undefined;
      const asyncReducer: Expected = ChimericAsyncReducer<Params>().build({
        serviceList: [
          {
            service: chimericSync,
            getParams: (params: Params) => params,
          },
        ],
        reducer: ([result]) => result,
      });

      expect(asyncReducer).toBeDefined();
    });
  });
});
