import { operations } from './apiSchema.types';

/**
 * path: '/api/posts'
 */

/**
 * 커뮤니티 게시글 조회(정렬, 검색)
 * @description 필터 조건, 검색어, 정렬 순서에 따라 카테고리 별 게시글 목록을 조회
 *     1. filter: 정렬 기준 선택
 *         - latest: 최신순  (기준 값: 게시글 Id)
 *         - likes : 좋아요순 (기준 값: 좋아요 수)
 *         - views : 조회수순 (기준 값: 조회수)
 *
 *     2. lastValue: 선택 된 정렬 기준의 마지막 정수 값, 타입 Long
 *         - 정렬 기준이 최신 순이면 현재 데이터의 마지막 Id 값
 *         - 정렬 기준이 좋아요 순이면 현재 데이터의 마지막 좋아요 값
 *         - 정렬 기준이 조회수 순이면 현재 데이터의 마지막 조회수 값
 *
 *     3. isAsc: 내림차순, 오름차순 여부
 *         - false: 기본값, 내림차순
 *         - true: 오름차순
 *
 *     4. limit: 출력 페이지 개수
 *         - 20개 (피그마에서는 5개였으나 확인이 필요함)
 *
 *     5. keyword: 게시글 제목 + 내용 검색어
 *
 *     6. categoryId: 게시글이 속한 카테고리 ID
 *
 */

export type FindAllPostQuery = operations['findAllPost']['parameters']['query'];
export type FindAllPostSuccessResponse =
  operations['findAllPost']['responses'][200]['content']['*/*'];

/**
 * 커뮤니티 게시글 생성
 * @description createPost(type: application/json)
 *     1. categoryId: 접속한 카테고리 ID
 *     2. title: 작성한 제목
 *     3. content: 작성한 내용
 *     4. imageList: 업로드한 이미지 정보(List)
 *         1) originalFileName: 업로드 파일명
 *         2) fileType: 파일 타입
 *         3) fileSize: 크기
 *
 *     postImage(type: multipartFile)
 *     - 이미지데이터
 *
 */

type CreatePostQuery = operations['createPost']['parameters']['query'];
type FindAllPostRequest = NonNullable<
  operations['createPost']['requestBody']
>['content']['application/json'];
type CreatePostSuccessResponse =
  operations['createPost']['responses'][200]['content']['*/*'];

/**
 * path: '/api/posts/{postId}'
 * postId: number
 */

/**
 * 커뮤니티 게시글 상세 조회
 * @description 1. 게시글 상세 조회(댓글은 나중에 작업)
 */

export type FindPostDetailQuery =
  operations['findPostDetail']['parameters']['query'];
export type FindPostDetailSuccessResponse =
  operations['findPostDetail']['responses'][200]['content']['*/*'];

/**
 * 커뮤니티 게시글 수정
 * @description updatePost(type: application/json)
 *     1. categoryId: 접속한 카테고리 ID
 *     2. title: 작성한 제목
 *     3. content: 작성한 내용
 *     4. imageList: 업로드한 이미지 정보(List)
 *         1) originalFileName: 업로드 파일명
 *         2) fileType: 파일 타입
 *         3) fileSize: 크기
 *
 *     postImage(type: multipartFile)
 *     - 이미지데이터
 *
 */

export type UpdatePostQuery = operations['updatePost']['parameters']['query'];
export type UpdatePostRequest = NonNullable<
  operations['updatePost']['requestBody']
>['content']['application/json'];
export type UpdatePostSuccessResponse =
  operations['updatePost']['responses'][200]['content']['*/*'];

/**
 * 커뮤니티 게시글 삭제
 */

export type DeletePostDetailQuery =
  operations['deletePost']['parameters']['query'];
export type DeletePostDetailSuccessResponse =
  operations['deletePost']['responses'][200]['content']['*/*'];
