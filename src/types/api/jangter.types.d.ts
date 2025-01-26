import { components, operations } from './apiSchema.types';

/**
 * path: '/api/jangter'
 */

/**
 * 판매글 생성
 * @description 덕후 장터 판매글 생성
 *     - createDTO: 판매글 정보를 포함한 JSON 데이터
 *     - productImage: 첨부할 이미지 파일 리스트 (이미지 파일, 필수값 아님)
 *
 */

type CreateProduct = NonNullable<
  operations['createProduct']['requestBody']
>['content']['multipart/form-data'];

export interface CreateProductRequest extends CreateProduct {
  imageList?: File[];
}
export type CreateProductSuccessResponse =
  operations['createProduct']['responses'][201]['content']['*/*'];

/**
 * path: '/api/jangter/{productId}'
 */

/**
 * 판매글 상세 조회
 * @description 덕후 장터 판매글 상세 조회
 */

type FindProductDetailSuccessResponse =
  operations['findProductDetail']['responses'][200]['content']['*/*'];

/**
 * 판매글 수정
 * @description 덕후 장터 판매글 수정
 *     - updateDTO: 판매글 정보를 포함한 JSON 데이터
 *     - updateImage: 첨부할 이미지 파일 리스트 (이미지 파일, 필수값 아님)
 *
 */

type UpdateProduct = NonNullable<
  operations['updateProduct']['requestBody']
>['content']['multipart/form-data'];

export interface UpdateProductRequest extends UpdateProduct {
  deleteImageUrl?: string[];
  imageList?: File[];
}
export type UpdateProductSuccessResponse =
  operations['updateProduct']['responses'][200]['content']['*/*'];

/**
 * 판매글 삭제
 * @description 덕후 장터 판매글 삭제
 */

export type deleteProductQuery =
  operations['deleteProduct']['parameters']['query'];
export type deleteProductSuccessResponse =
  operations['deleteProduct']['responses'][200]['content']['*/*'];

/**
 * path: '/api/jangter/{productId}/recommend'
 */

/**
 * 판매글 추천
 * @description 판매글 추천 API (로그인/비로그인 모두 가능)
 */

export type RecommendedProduct = components['schemas']['RecommendProduct'];
export type findRecommendedProductSuccessResponse =
  operations['recommendProduct']['responses'][200]['content']['*/*'];

/**
 * path: '/api/itemCategory'
 */

/**
 * 덕후장터 아이템 카테고리 전체 조회
 * @description API로 GET요청시 덕후장터 아이템 카테고리 ID와 NAME이 List로 반환됨
 */

export type GetAllItemCategoriesSuccessResponse =
  operations['getAllItemCategories']['responses'][200]['content']['*/*'];
export type ItemCategoriesIdList = number[];
export type itemCategoryNameList = string[];
