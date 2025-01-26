import { operations } from './apiSchema.types';

/**
 * path: '/api/shorts'
 */

/**
 * 쇼츠 업로드
 * @description 파일을 스토리지에 업로드합니다.
 */

type UploadShortsRequest = NonNullable<
  operations['uploadFile_1']['requestBody']
>['content']['multipart/form-data'];

/**
 * path: '/api/shorts/{shortsId}'
 */

/**
 * Shorts 상세 정보 조회
 * @description 쇼츠 동영상에 필요한 정보 반환
 */

type FindShortsInfoSuccessResponse =
  operations['findShortsInfo']['responses'][200]['content']['*/*'];

/**
 * path: '/api/shorts/{shortsId}/comment'
 */

/**
 * 쇼츠 댓글 조회
 * @description 쇼츠 댓글을 조회합니다.
 */

export type FindShortsCommentSuccessResponse =
  operations['findShortsComment']['responses'][200]['content']['*/*'];

/**
 * 쇼츠 댓글 생성
 * @description 쇼츠 댓글을 생성합니다.
 */

export type CreateShortsCommentRequest = NonNullable<
  operations['createShortsComment']['requestBody']
>['content']['application/json'];
export type CreateShortsCommentSuccessResponse =
  operations['createShortsComment']['responses'][200]['content']['*/*'];

/**
 * path: '/api/shorts/{shortsId}/comment/{commentId}'
 * @description shortsId: 쇼츠 아이디
 * @description commentId: 댓글 아이디
 */

/**
 * 쇼츠 댓글 수정
 * @description 쇼츠 댓글을 수정합니다.
 */

export type UpdateShortsCommentRequest = NonNullable<
  operations['updateShortsComment']['requestBody']
>['content']['application/json'];
export type UpdateShortsCommentSuccessResponse =
  operations['updateShortsComment']['responses'][200]['content']['*/*'];

/**
 * 쇼츠 댓글 삭제
 * @description 쇼츠 댓글을 삭제합니다.
 */

export type DeleteShortsCommentSuccessResponse =
  operations['deleteShortsComment']['responses'][200]['content']['*/*'];

/**
 * path: '/api/shorts/{shortsId}/comment/{commentId}/reply'
 * @description shortsId: 쇼츠 아이디
 * @description commentId: 댓글 아이디
 */

/**
 * 쇼츠 댓글 대댓글 생성
 * @description 쇼츠 댓글 대댓글을 생성합니다.
 */

export type CreateShortsReplyRequest = NonNullable<
  operations['createShortsReply']['requestBody']
>['content']['application/json'];
export type CreateShortsReplySuccessResponse =
  operations['createShortsReply']['responses'][200]['content']['*/*'];

/**
 * path: '/api/shorts/{shortsId}/comment/{commentId}/reply/{replyId}'
 * @description shortsId: 쇼츠 아이디
 * @description commentId: 댓글 아이디
 * @description replyId: 대댓글 아이디
 */

/**
 * 쇼츠 댓글 대댓글 수정
 * @description 쇼츠 댓글 대댓글을 수정합니다.
 */

export type UpdateShortsReplyRequest = NonNullable<
  operations['updateShortsReply']['requestBody']
>['content']['application/json'];
export type UpdateShortsReplySuccessResponse =
  operations['updateShortsReply']['responses'][200]['content']['*/*'];

/**
 * 쇼츠 댓글 대댓글 삭제
 * @description 쇼츠 댓글 대댓글을 삭제합니다.
 */

export type DeleteShortsReplySuccessResponse =
  operations['deleteShortsReply']['responses'][200]['content']['*/*'];

/**
 * path: '/api/shorts/recommend'
 */

/**
 * 쇼츠 추천
 * @description 쇼츠를 추천합니다.
 */

export type GetRecommendShortsSuccessResponse =
  operations['getRecommendShorts']['responses'][200]['content']['*/*'];

/**
 * path: '/api/shorts/{shortsId}/likes'
 */

/**
 * Shorts 좋아요
 * @description 쇼츠 동영상에 로그인 한 유저가 좋아요를 누름
 */

export type AddShortsLikeSuccessResponse =
  operations['addLike']['responses'][200]['content']['*/*'];
/**
 * path: '/api/shorts/{shortsId}/likes/cancel'
 */

/**
 * Shorts 좋아요 취소
 * @description 쇼츠 동영상에 좋아요한 유저가 취소를 누름
 */

export type CancelLikeSuccessResponse =
  operations['cancelLike']['responses'][200]['content']['*/*'];
