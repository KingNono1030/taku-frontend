import { ducku, duckuWithAuth } from '@/lib/axiosInstance';
import {
  CreateProductRequest,
  CreateProductSuccessResponse,
  FindProductDetailSuccessResponse,
  FindProductItemsQuery,
  FindProductItemsSuccessResponse,
  FindUserPurchaseQuery,
  FindUserPurchaseResponse,
  GetBookmarkListQuery,
  GetBookmarkListResponse,
  // FindUserPurchaseQuery,
  // FindUserPurchaseResponse,
  GetJangterRankSuccessResponse,
  UpdateProductRequest,
  UpdateProductStatusRequest,
  UpdateProductStatusSuccessResponse,
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

export const getProductItems = async (
  params?: FindProductItemsQuery,
): Promise<FindProductItemsSuccessResponse> => {
  const { data } = await ducku.get('api/jangter/products', { params });
  return data;
};

export const getUserPurchase = async (
  userId: number,
  queryParams: FindUserPurchaseQuery,
): Promise<FindUserPurchaseResponse> => {
  const { page, size, sort } = queryParams as {
    page: number;
    size: number;
    sort: string;
  };
  const [sortKey, sortWay] = sort.split(',');
  const { data } = await duckuWithAuth.get(
    `/api/user-janger/${userId}/purchase?page=${page}&size=${size}20&sort=${sortKey}%2C${sortWay}`,
  );
  return data;
};

export const updateProductStatus = async (
  productId: number,
  requestBody: UpdateProductStatusRequest,
): Promise<UpdateProductStatusSuccessResponse> => {
  const { data } = await duckuWithAuth.patch(
    `api/jangter/${productId}/status`,
    requestBody,
  );
  return data;
};

export const getJangterBookmarks = async (
  queryParams: GetBookmarkListQuery,
): Promise<GetBookmarkListResponse> => {
  const { categoryId, page, size, sort } = queryParams as {
    categoryId: number;
    page: number;
    size: number;
    sort: string[];
  };
  const [sortKey, sortWay] = sort;
  const { data } = await duckuWithAuth.get(
    `/api/bookmarks/jangter?categoryId=${categoryId}&page=${page}&size=${size}&sort=${sortKey}%2C${sortWay}`,
  );
  return data;
};

export const addJangterBookmarks = async (productId: number) => {
  const { data } = await duckuWithAuth.post(
    `/api/bookmarks/jangter?productId=${productId}`,
    {
      productId,
    },
  );
  return data;
};
export const deleteJangterBookmarks = async (productId: number) => {
  const { data } = await duckuWithAuth.delete(
    `/api/bookmarks/jangter/${productId}`,
  );
  return data;
};
