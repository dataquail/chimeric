import {
  IdiomaticMutationFactory,
  ReactiveMutationFactory,
} from '@chimeric/react-query';
import { QueryClient } from '@tanstack/react-query';

export const MutationTestFixtures = {
  withoutParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        idiomaticMutation: IdiomaticMutationFactory({
          queryClient,
          mutationFn: fn,
        }),
      };
    },
    getReactive: () => {
      const invokeFn = vi.fn(async () => 'test');
      return {
        invokeFn,
        reactiveMutation: ReactiveMutationFactory({
          mutationFn: invokeFn,
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticMutation } =
        MutationTestFixtures.withoutParams.getIdiomatic(queryClient);
      const { reactiveMutation, invokeFn } =
        MutationTestFixtures.withoutParams.getReactive();
      return {
        idiomaticMutation,
        reactiveMutation,
        invokeFn,
      };
    },
  },
  withParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(
        async (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        idiomaticMutation: IdiomaticMutationFactory({
          queryClient,
          mutationFn: fn,
        }),
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        async (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        reactiveMutation: ReactiveMutationFactory({
          mutationFn: fn,
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticMutation } =
        MutationTestFixtures.withParams.getIdiomatic(queryClient);
      const { reactiveMutation, fn } =
        MutationTestFixtures.withParams.getReactive();
      return {
        idiomaticMutation,
        reactiveMutation,
        fn,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(async (params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        idiomaticMutation: IdiomaticMutationFactory({
          queryClient,
          mutationFn: fn,
        }),
      };
    },
    getReactive: () => {
      const fn = vi.fn(async (params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        reactiveMutation: ReactiveMutationFactory({
          mutationFn: fn,
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticMutation } =
        MutationTestFixtures.withOptionalParams.getIdiomatic(queryClient);
      const { reactiveMutation, fn } =
        MutationTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticMutation,
        reactiveMutation,
        fn,
      };
    },
  },
};
