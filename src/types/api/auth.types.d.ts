import { operations } from './apiSchema.types';

/**
 * path: '/api/auth/logout'
 */

/**
 * 로그아웃
 */

export type LogoutSuccessResponse =
  operations['logout']['responses'][200]['content']['*/*'];

/**
 * 카테고리 생성
 * @description 새로운 카테고리를 생성합니다. 카테고리 정보와 이미지를 함께 업로드해야 합니다.
 */

export type CreateCategoriesRequest = NonNullable<
  operations['createCategory']['requestBody']
>['content']['multipart/form-data'];
export type CreateCategoriesSuccessResponse =
  operations['createCategory']['responses'][201]['content']['*/*'];
