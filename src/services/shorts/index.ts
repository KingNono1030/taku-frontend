import { AxiosResponse } from 'axios';

import ducku, {
  duckuWithAuthFormData,
  duckuWithAuthJSON,
} from '@/lib/axiosInstance';
import { UploadShortsRequest } from '@/types/api/shorts.types';

/**
 * 쇼츠 업로드 서비스
 * @param requestBody 업로드할 쇼츠 데이터
 */
export const uploadShorts = async (
  requestBody: UploadShortsRequest,
): Promise<AxiosResponse> => {
  const { data } = await duckuWithAuthFormData.post('/api/shorts', requestBody);
  return data;
};

/**
 * 쇼츠 추천 리스트 조회 서비스
 * @returns 쇼츠 리스트
 */
export const getShortsList = async () => {
  const { data } = await ducku.get('/api/shorts/recommend');
  return data;
};

/**
 * 쇼츠 상세 조회 서비스
 * @param shortsId 쇼츠 ID
 */
export const getShortsDetail = async (shortsId: string) => {
  const { data } = await ducku.get(`/api/shorts/${shortsId}`);
  return data;
};

/**
 * 쇼츠 댓글 목록 조회 서비스
 * @param shortsId 쇼츠 ID
 */
export const getShortsComment = async (shortsId: string) => {
  const { data } = await ducku.get(`/api/shorts/${shortsId}/comment`);
  return data;
};

/**
 * 쇼츠 댓글 생성 서비스
 * @param shortsId 쇼츠 ID
 * @param requestBody 댓글 생성 요청 데이터
 */
export const createShortsComment = async (
  shortsId: string,
  requestBody: { content: string },
) => {
  const { data } = await duckuWithAuthJSON.post(
    `/api/shorts/${shortsId}/comment`,
    requestBody,
  );
  return data;
};

/**
 * 쇼츠 댓글 수정 서비스
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param requestBody 댓글 수정 요청 데이터
 */
export const updateShortsComment = async (
  shortsId: string,
  commentId: string,
  requestBody: { content: string },
) => {
  const { data } = await duckuWithAuthJSON.patch(
    `/api/shorts/${shortsId}/comment/${commentId}`,
    requestBody,
  );
  return data;
};

/**
 * 쇼츠 댓글 삭제 서비스
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 */
export const deleteShortsComment = async (
  shortsId: string,
  commentId: string,
) => {
  const { data } = await duckuWithAuthJSON.delete(
    `/api/shorts/${shortsId}/comment/${commentId}`,
  );
  return data;
};

/**
 * 쇼츠 대댓글 생성 서비스
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param requestBody 대댓글 생성 요청 데이터
 */
export const createShortsCommentReply = async (
  shortsId: string,
  commentId: string,
  requestBody: { content: string },
) => {
  const { data } = await duckuWithAuthJSON.post(
    `/api/shorts/${shortsId}/comment/${commentId}/reply`,
    requestBody,
  );
  return data;
};

/**
 * 쇼츠 대댓글 수정 서비스
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param replyId 대댓글 ID
 * @param requestBody 대댓글 수정 요청 데이터
 */
export const updateShortsCommentReply = async (
  shortsId: string,
  commentId: string,
  replyId: string,
  requestBody: { content: string },
) => {
  const { data } = await duckuWithAuthJSON.patch(
    `/api/shorts/${shortsId}/comment/${commentId}/reply/${replyId}`,
    requestBody,
  );
  return data;
};

/**
 * 쇼츠 대댓글 삭제 서비스
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param replyId 대댓글 ID
 */
export const deleteShortsCommentReply = async (
  shortsId: string,
  commentId: string,
  replyId: string,
) => {
  const { data } = await duckuWithAuthJSON.delete(
    `/api/shorts/${shortsId}/comment/${commentId}/reply/${replyId}`,
  );
  return data;
};
