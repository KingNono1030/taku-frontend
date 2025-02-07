import { duckuWithAuthFormData, duckuWithAuthJSON } from '@/lib/axiosInstance';

type CommunityCommentRequest = {
  postId: string;
  content: string;
  parentCommentId?: string;
};

/**
 * 커뮤니티 댓글 생성 서비스
 * @param requestBody 댓글 생성 요청 데이터
 */
export const createCommunityComment = async (
  requestBody: CommunityCommentRequest,
) => {
  const { data } = await duckuWithAuthFormData.post(
    `/api/community/comments`,
    requestBody,
  );
  return data;
};

/**
 * 커뮤니티 상세 조회 서비스
 */
export const getCommunityDetail = async (postId: string) => {
  const { data } =
    await duckuWithAuthJSON.get(`/api/community/posts/${postId}?canAddView=true
`);
  return data;
};

/**
 * 쇼츠 댓글 수정 서비스
 * @param commentsId 댓글 ID
 * @param requestBody 댓글 수정 요청 데이터
 */
export const updateCommunityComment = async (
  commentsId: string,
  requestBody: { postId: string; content: string },
) => {
  const { data } = await duckuWithAuthFormData.put(
    `/api/community/comments/${commentsId}`,
    requestBody,
  );
  return data;
};

/**
 * 커뮤니티 댓글 삭제 서비스
 * @param commentsId  댓글 ID
 */
export const deleteCommunityComment = async (commentsId: string) => {
  const { data } = await duckuWithAuthJSON.delete(
    `/api/community/comments/${commentsId}`,
  );
  return data;
};
