import { operations } from './apiSchema.types';

/**
 * path: '/api/category'
 */

/**
 * 카테고리 검색
 * @description 카테고리를 검색합니다. 페이징과 정렬을 지원합니다.
 */

export type SearchCategoriesQuery =
  operations['searchCategories']['parameters']['query'];
export type SearchCategoriesSuccessResponse =
  operations['searchCategories']['responses'][200]['content']['*/*'];

/**
 * 카테고리 생성
 * @description 새로운 카테고리를 생성합니다. 카테고리 정보와 이미지를 함께 업로드해야 합니다.
 */

export type CreateCategoriesRequest = NonNullable<
  operations['createCategory']['requestBody']
>['content']['multipart/form-data'];
export type CreateCategoriesSuccessResponse =
  operations['createCategory']['responses'][201]['content']['*/*'];

/**
 * path: '/api/category/{id}'
 */

/**
 * 카테고리 상세 조회
 * @description 카테고리 ID로 상세 정보를 조회합니다.
 */

export type FindCategoryByIdSuccessResponse =
  operations['findCategoryById']['responses'][200]['content']['*/*'];
