import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  createProduct,
  deleteProduct,
  getJangterRank,
  getProductDetail,
  getProductItems,
  getRecommendedProductDetail,
  getUserPurchase,
  updateProduct,
  updateProductStatus,
} from '@/services/jangter';
import type {
  CreateProductRequest,
  FindProductItemsQuery,
  FindUserPurchaseQuery,
  JangterProduct,
  UpdateProductRequest,
  UpdateProductStatusRequest,
} from '@/types/api/jangter.types';

export const useCreateProduct = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (requestBody: CreateProductRequest) => {
      return createProduct(requestBody);
    },
    onSuccess: (data) => {
      // 요청 성공 시 실행할 로직
      const { data: productId } = data;
      console.log('Mutation succeeded:', productId);
      navigate(`/market/${productId}`);
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
    },
  });
};

export const useUpdateteProduct = (productId: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (requestBody: UpdateProductRequest) => {
      return updateProduct(productId, requestBody);
    },
    onSuccess: () => {
      // 요청 성공 시 실행할 로직
      console.log('Mutation succeeded:', productId);
      navigate(`/market/${productId}`);
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
    },
  });
};

export const useDeleteProduct = (productId: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      deleteProduct(productId);
    },
    onSuccess: () => {
      // 요청 성공 시 실행할 로직
      console.log('Mutation succeeded:', productId);
      navigate(`/market/`);
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
    },
  });
};

export const useProductDetails = (productId: number) => {
  return useQuery({
    queryKey: ['products', productId, 'detail'],
    queryFn: () => getProductDetail(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useRecommendedProducts = (productId: number) => {
  return useQuery({
    queryKey: ['products', productId, 'recommended'],
    queryFn: () => getRecommendedProductDetail(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useJangterRank = () => {
  return useQuery({
    queryKey: ['jangter', 'rank'],
    queryFn: () => getJangterRank(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useProductItems = (
  queryParams: Omit<FindProductItemsQuery, 'lastId'>,
) => {
  return useInfiniteQuery({
    queryKey: ['productItems', queryParams],
    queryFn: async ({ pageParam }) => {
      const response = await getProductItems({
        ...queryParams,
        lastId: pageParam as number | undefined,
      });
      return response;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (data) => {
      const lastPage = data?.data as JangterProduct[];
      if (lastPage.length < queryParams.size!) {
        return undefined;
      }
      return lastPage[lastPage.length - 1]?.id;
    },
  });
};

export const useUserPurchase = (
  userId: number,
  queryParams: FindUserPurchaseQuery,
) => {
  return useQuery({
    queryKey: ['userPurchases', queryParams],
    queryFn: () => getUserPurchase(userId, queryParams),
    staleTime: 1000 * 60 * 5, // 5분
    retry: 2,
  });
};

export const useUpdateteProductStatus = (productId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: UpdateProductStatusRequest) => {
      return updateProductStatus(productId, requestBody);
    },
    onSuccess: () => {
      // 요청 성공 시 실행할 로직
      queryClient.invalidateQueries({
        queryKey: ['products', productId, 'detail'],
      });
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('Mutation failed:', error);
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
    },
  });
};
