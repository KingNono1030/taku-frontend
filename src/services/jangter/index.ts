import { ducku, duckuWithAuth } from '@/lib/axiosInstance';
import {
  CreateProductRequest,
  CreateProductSuccessResponse,
  FindProductDetailSuccessResponse,
  FindProductItemsSuccessResponse,
  GetJangterRankSuccessResponse,
  UpdateProductRequest,
  UpdateProductSuccessResponse,
  deleteProductSuccessResponse,
  findRecommendedProductSuccessResponse,
} from '@/types/api/jangter.types';

export const createProduct = async (
  requestBody: CreateProductRequest,
): Promise<CreateProductSuccessResponse> => {
  const { data } = await duckuWithAuth.post('api/jangter', requestBody, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const getProductDetail = async (
  productId: number,
): Promise<FindProductDetailSuccessResponse> => {
  const { data } = await ducku.get(`api/jangter/${productId}`);
  return data;
};

export const updateProduct = async (
  productId: number,
  requestBody: UpdateProductRequest,
): Promise<UpdateProductSuccessResponse> => {
  const { data } = await duckuWithAuth.put(
    `api/jangter/${productId}`,
    requestBody,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

export const deleteProduct = async (
  productId: number,
): Promise<deleteProductSuccessResponse> => {
  const { data } = await duckuWithAuth.delete(`api/jangter/${productId}`);
  return data;
};

export const getRecommendedProductDetail = async (
  productId: number,
): Promise<findRecommendedProductSuccessResponse> => {
  const { data } = await ducku.get(`api/jangter/${productId}/recommend`);
  return data;
};

export const getJangterRank =
  async (): Promise<GetJangterRankSuccessResponse> => {
    const { data } = await ducku.get('api/jangter/rank');
    return data;
  };

export const getProductItems =
  async (): Promise<FindProductItemsSuccessResponse> => {
    const { data } = await ducku.get('api/jangter/products');
    return data;
  };
