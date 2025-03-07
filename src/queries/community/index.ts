import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCommunityBookmark,
  createCommunityCategory,
  createCommunityComment,
  createCommunityDetail,
  deleteCommunityBookmark,
  deleteCommunityComment,
  deleteCommunityDetail,
  getCommunityBookmark,
  getCommunityDetail,
  getCommunityGenres,
  getPopularCommunityPosts,
  likeCommunityDetail,
  updateCommunityComment,
  updateCommunityDetail,
} from '@/services/community';
import {
  CreateCommentsRequestBody,
  CreatePostQueryRequest,
  UpdateCommentsRequestBody,
  UpdatePostQueryRequest,
} from '@/types/api/community.types';

type ResponseType = {
  success: boolean;
  data: number;
  error: {
    code: number;
    message: string;
  };
};

type UseMutationProps = {
  // eslint-disable-next-line no-unused-vars
  onSuccessCb?: (data: ResponseType) => void;
  onErrorCb?: () => void;
  onSettledCb?: () => void;
};

interface UseUpdateMutationProps extends UseMutationProps {
  postId: string;
}

/**
 * 커뮤니티 상세 조회 커스텀 훅
 * @param postId 쇼츠 ID
 */
export const useCommunityDetail = (postId: string) => {
  return useQuery({
    queryKey: ['communityDetail', postId],
    queryFn: async () => postId && (await getCommunityDetail(postId)),
    enabled: !!postId,
    retry: 2,
  });
};

/**
 * 커뮤니티 상세 등록 커스텀 훅
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useCreateCommunityDetail = ({
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseMutationProps) => {
  return useMutation({
    mutationFn: async (requestBody: CreatePostQueryRequest) => {
      return createCommunityDetail(requestBody);
    },
    onSuccess: (data) => {
      // 요청 성공 시 실행할 로직
      console.log('커뮤니티 등록 성공', data);
      onSuccessCb && onSuccessCb(data);
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('Mutation failed:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 상세 수정 커스텀 훅
 * @param postId 쇼츠 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useUpdateCommunityDetail = ({
  postId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseUpdateMutationProps) => {
  return useMutation({
    mutationFn: async (requestBody: UpdatePostQueryRequest) => {
      return updateCommunityDetail(postId, requestBody);
    },
    onSuccess: (data) => {
      console.log('커뮤니티 수정 성공:', data);
      onSuccessCb && onSuccessCb(data);
    },
    onError: (error) => {
      console.error('커뮤니티 수정 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 상세 삭제 커스텀 훅
 */
export const useDeleteCommunityDetail = ({
  postId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseUpdateMutationProps) => {
  return useMutation({
    mutationFn: async () => {
      return deleteCommunityDetail(postId);
    },
    onSuccess: (data) => {
      console.log('커뮤니티 삭제 성공:', data);
      onSuccessCb && onSuccessCb(data);
    },
    onError: (error) => {
      console.error('커뮤니티 삭제 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 게시글 좋아요
 */
export const useLikeCommunityDetail = ({
  postId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseUpdateMutationProps) => {
  return useMutation({
    mutationFn: async () => {
      return likeCommunityDetail(postId);
    },
    onSuccess: (data) => {
      console.log('커뮤니티 좋아요 성공:', data);
      onSuccessCb && onSuccessCb(data);
    },
    onError: (error) => {
      console.error('커뮤니티 좋아요 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 댓글 등록 커스텀 훅
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useCreateCommunityComment = ({
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseMutationProps) => {
  return useMutation({
    mutationFn: async (requestBody: CreateCommentsRequestBody) => {
      return createCommunityComment(requestBody);
    },
    onSuccess: (data) => {
      console.log('댓글 등록 성공:', data);
      onSuccessCb && onSuccessCb(data);
    },
    onError: (error) => {
      console.error('댓글 등록 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

type UseCommentProps = {
  commentsId: string;
  onSuccessCb?: () => void;
  onErrorCb?: () => void;
  onSettledCb?: () => void;
};

/**
 * 커뮤니티 댓글 수정 커스텀 훅
 * @param commentsId 댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useUpdateCommunityComment = ({
  commentsId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseCommentProps) => {
  return useMutation({
    mutationFn: async (requestBody: UpdateCommentsRequestBody) => {
      return updateCommunityComment(commentsId, requestBody);
    },
    onSuccess: (data) => {
      console.log('댓글 수정 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('댓글 수정 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 댓글 삭제 커스텀 훅
 * @param commentsId  댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useDeleteCommunityComment = ({
  commentsId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseCommentProps) => {
  return useMutation({
    mutationFn: async () => {
      return deleteCommunityComment(commentsId);
    },
    onSuccess: (data) => {
      console.log('댓글 삭제 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('댓글 삭제 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 장르 조회 커스텀 훅
 */
export const useCommunityGenres = () => {
  return useQuery({
    queryKey: ['communityGenres'],
    queryFn: async () => await getCommunityGenres(),
  });
};

type CreateCategoryRequest = {
  category_name: string;
  ani_genre_id: string[];
  image?: File;
};

/**
 * 커뮤니티 카테고리 등록 커스텀 훅
 */
export const useCreateCommunityCategory = ({
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseMutationProps) => {
  return useMutation({
    mutationFn: async (requestBody: CreateCategoryRequest) => {
      return createCommunityCategory(requestBody);
    },
    onSuccess: (data) => {
      console.log('카테고리 등록 성공:', data);
      onSuccessCb && onSuccessCb(data);
    },
    onError: (error) => {
      console.error('카테고리 등록 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 북마크 조회 커스텀 훅
 */
export const useCommunityBookmark = () => {
  return useQuery({
    queryKey: ['communityBookmark'],
    queryFn: async () => await getCommunityBookmark(),
  });
};

type CreateBookmarkParam = {
  categoryId: string;
  onSuccessCb?: () => void;
  onErrorCb?: () => void;
  onSettledCb?: () => void;
};

/**
 * 커뮤니티 북마크 등록 커스텀 훅
 */
export const useCreateCommunityBookmark = ({
  categoryId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: CreateBookmarkParam) => {
  return useMutation({
    mutationFn: async () => {
      return createCommunityBookmark(categoryId);
    },
    onSuccess: (data) => {
      console.log('북마크 등록 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('북마크 등록 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 커뮤니티 북마크 삭제 커스텀 훅
 */
export const useDeleteCommunityBookmark = ({
  categoryId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: CreateBookmarkParam) => {
  return useMutation({
    mutationFn: async () => {
      return deleteCommunityBookmark(categoryId);
    },
    onSuccess: (data) => {
      console.log('북마크 삭제 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('북마크 삭제 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 인기 커뮤니티 게시글 조회 커스텀 훅
 */
export const usePopularCommunityPosts = ({
  periodType,
}: {
  periodType: string;
}) => {
  return useQuery({
    queryKey: ['popularCommunityPosts', periodType],
    queryFn: async () => {
      return await getPopularCommunityPosts(periodType);
    },
  });
};
