import {
  ducku,
  duckuWithAuthFormData,
  duckuWithAuthJSON,
} from '@/lib/axiosInstance';
import {
  CreateProductRequest,
  CreateProductSuccessResponse,
  FindProductDetailSuccessResponse,
  UpdateProductRequest,
  UpdateProductSuccessResponse,
  deleteProductSuccessResponse,
  findRecommendedProductSuccessResponse,
} from '@/types/api/jangter.types';

export const createProduct = async (
  requestBody: CreateProductRequest,
): Promise<CreateProductSuccessResponse> => {
  const { data } = await duckuWithAuthFormData.post('api/jangter', requestBody);
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
  const { data } = await duckuWithAuthFormData.put(
    `api/jangter/${productId}`,
    requestBody,
  );
  return data;
};

export const deleteProduct = async (
  productId: number,
): Promise<deleteProductSuccessResponse> => {
  const { data } = await duckuWithAuthJSON.delete(`api/jangter/${productId}`);
  return data;
};

export const getRecommendedProductDetail = async (
  productId: number,
): Promise<findRecommendedProductSuccessResponse> => {
  const { data } = await ducku.get(`api/jangter/${productId}/recommend`);
  return data;
};
