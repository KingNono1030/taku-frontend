import ducku, { duckuWithAuth, duckuWithoutAuth } from '@/lib/axiosInstance';
import {
  CreatePostQueryRequest,
  UpdatePostQueryRequest,
} from '@/types/api/community.types';

type CommunityCommentRequest = {
  postId: string;
  content: string;
  parentCommentId?: string;
};

/**
 * 커뮤니티 상세 조회 서비스
 */
export const getCommunityDetail = async (postId: string) => {
  const { data } =
    await duckuWithoutAuth.get(`/api/community/posts/${postId}?canAddView=true
`);
  return data;
};

/**
 * 커뮤니티 상세 등록 서비스
 */
export const createCommunityDetail = async (
  requestBody: CreatePostQueryRequest,
) => {
  const { data } = await duckuWithAuth.post(
    '/api/community/posts',
    requestBody,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

/**
 * 커뮤니티 상세 삭제 서비스
 */
export const deleteCommunityDetail = async (postId: string) => {
  const { data } = await duckuWithAuth.delete(`/api/community/posts/${postId}`);
  return data;
};

/**
 * 커뮤니티 상세 좋아요 서비스
 */
export const likeCommunityDetail = async (postId: string) => {
  const { data } = await duckuWithAuth.post(
    `/api/community/posts/${postId}/like`,
  );
  return data;
};

/**
 * 커뮤니티 상세 업데이트 서비스
 */
export const updateCommunityDetail = async (
  postId: string,
  requestBody: UpdatePostQueryRequest,
) => {
  const { data } = await duckuWithAuth.put(
    `/api/community/posts/${postId}`,
    requestBody,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

/**
 * 커뮤니티 댓글 생성 서비스
 * @param requestBody 댓글 생성 요청 데이터
 */
export const createCommunityComment = async (
  requestBody: CommunityCommentRequest,
) => {
  const { data } = await duckuWithAuth.post(
    `/api/community/comments`,
    requestBody,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
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
  const { data } = await duckuWithAuth.put(
    `/api/community/comments/${commentsId}`,
    requestBody,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

/**
 * 커뮤니티 댓글 삭제 서비스
 * @param commentsId  댓글 ID
 */
export const deleteCommunityComment = async (commentsId: string) => {
  const { data } = await duckuWithAuth.delete(
    `/api/community/comments/${commentsId}`,
  );
  return data;
};

/**
 * 커뮤니티 장르 조회 서비스
 */
export const getCommunityGenres = async () => {
  const { data } = await ducku.get('/api/category/genres');
  return data;
};

/**
 * 커뮤니티 카테고리 등록 서비스
 */
export const createCommunityCategory = async (requestBody: {
  category_name: string;
  ani_genre_id: string[];
  image?: File;
}) => {
  const { data } = await duckuWithAuth.post('/api/category', requestBody, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

/**
 * 커뮤니티 카테고리 북마크 조회 서비스
 */
export const getCommunityBookmark = async () => {
  const { data } = await duckuWithoutAuth.get('/api/category-bookmark');
  return data;
};

/**
 * 커뮤니티 카테고리 북마크 등록 서비스
 */
export const createCommunityBookmark = async (categoryId: string) => {
  const { data } = await duckuWithAuth.post(
    `/api/category-bookmark/${categoryId}`,
  );
  return data;
};

/**
 * 커뮤니티 카테고리 북마크 삭제 서비스
 */
export const deleteCommunityBookmark = async (categoryId: string) => {
  const { data } = await duckuWithAuth.delete(
    `/api/category-bookmark/${categoryId}`,
  );
  return data;
};

/**
 * 인기 커뮤니티 게시글 조회 서비스
 */
export const getPopularCommunityPosts = async (periodType: string) => {
  const { data } = await ducku.get(
    `/api/community/posts/popular?periodType=${periodType}`,
  );
  return data;
};
