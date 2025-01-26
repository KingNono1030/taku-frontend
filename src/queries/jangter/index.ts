import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getRecommendedProductDetail,
  updateProduct,
} from '@/services/jangter';
import type {
  CreateProductRequest,
  UpdateProductRequest,
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
