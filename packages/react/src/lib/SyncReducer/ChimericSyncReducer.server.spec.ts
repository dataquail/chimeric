import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/core';
import { ChimericSyncReducer } from './ChimericSyncReducer.server';

describe('ChimericSyncReducerServer', () => {
  const createStoreAndServices = () => {
    let items: Array<{ id: number; text: string }> = [];
    let nextId = 0;

    const addItem = () => {
      items = [...items, { id: nextId, text: `Item #${nextId + 1}` }];
      nextId++;
    };

    const getSnapshot = () => items;

    const idiomaticGetAll = createIdiomaticSync(() => getSnapshot());
    const reactiveGetAll = createReactiveSync(() => getSnapshot());
    const getAllItems = fuseChimericSync({
      idiomatic: idiomaticGetAll,
      reactive: reactiveGetAll,
    });

    const idiomaticGetById = createIdiomaticSync(
      (id: number) => getSnapshot().find((item) => item.id === id),
    );
    const reactiveGetById = createReactiveSync(
      (id: number) => getSnapshot().find((item) => item.id === id),
    );
    const getItemById = fuseChimericSync({
      idiomatic: idiomaticGetById,
      reactive: reactiveGetById,
    });

    const idiomaticGetIdOrDefault = createIdiomaticSync(
      (id?: number) => getSnapshot().find((item) => item.id === id)?.id ?? 1,
    );
    const reactiveGetIdOrDefault = createReactiveSync(
      (id?: number) => getSnapshot().find((item) => item.id === id)?.id ?? 1,
    );
    const getItemIdOrDefault = fuseChimericSync({
      idiomatic: idiomaticGetIdOrDefault,
      reactive: reactiveGetIdOrDefault,
    });

    return { addItem, getSnapshot, getAllItems, getItemById, getItemIdOrDefault };
  };

  it('should be defined', () => {
    expect(ChimericSyncReducer).toBeDefined();
  });

  describe('idiomatic', () => {
    it('should aggregate from one idiomatic sync interface', () => {
      const { addItem, getAllItems } = createStoreAndServices();

      expect(getAllItems().length).toBe(0);

      addItem();

      expect(getAllItems().length).toBe(1);

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [{ service: getAllItems }],
        reducer: ([items], params) => {
          return items[params].id;
        },
      });

      expect(TestChimericSyncReducer(0)).toEqual(0);
    });

    it('should aggregate multiple idiomatic sync interfaces', () => {
      const { addItem: addItem1, getAllItems: getAllItems1 } =
        createStoreAndServices();
      const { addItem: addItem2, getItemById: getItemById2 } =
        createStoreAndServices();

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [
          { service: getAllItems1 },
          {
            service: getItemById2,
            getParams: (index: Args) => index,
          },
        ],
        reducer: ([items, item], params) => {
          return `${items[params]?.id} + ${item?.id}`;
        },
      });

      expect(TestChimericSyncReducer(0)).toEqual('undefined + undefined');

      addItem1();
      addItem2();

      expect(TestChimericSyncReducer(0)).toEqual('0 + 0');
    });

    it('should handle optional service params', () => {
      const { addItem: addItem1, getAllItems: getAllItems1, getItemIdOrDefault } =
        createStoreAndServices();

      type Args = number | undefined;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [
          { service: getAllItems1 },
          {
            service: getItemIdOrDefault,
            getParams: (index: Args) => index || 1,
          },
        ],
        reducer: ([items, itemId], params) => {
          return `${items[params || 0]?.id} + ${itemId}`;
        },
      });

      expect(TestChimericSyncReducer(0)).toEqual('undefined + 1');

      addItem1();

      expect(TestChimericSyncReducer(0)).toEqual('0 + 1');
    });
  });

  // SERVER ERRORS
  describe('SERVER ERRORS', () => {
    it('useHook throws', () => {
      const { getAllItems } = createStoreAndServices();

      type Args = number;
      const TestChimericSyncReducer = ChimericSyncReducer<Args>().build({
        serviceList: [{ service: getAllItems }],
        reducer: ([items], params) => items[params]?.id,
      });

      expect(() => TestChimericSyncReducer.useHook(0)).toThrow(
        "@chimeric/react: useHook() cannot be called in a server component. Hooks are only available in client components marked with 'use client'.",
      );
    });
  });
});
