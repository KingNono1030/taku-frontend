import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCommunityComment,
  deleteCommunityComment,
  getCommunityDetail,
  updateCommunityComment,
} from '@/services/community';
import {
  CreateCommentsRequestBody,
  UpdateCommentsRequestBody,
} from '@/types/api/community.types';

type UseMutationProps = {
  onSuccessCb?: () => void;
  onErrorCb?: () => void;
  onSettledCb?: () => void;
};

/**
 * 커뮤니티 상세 조회 커스텀 훅
 * @param postId 쇼츠 ID
 */
export const useCommunityDetail = (postId: string) => {
  return useQuery({
    queryKey: ['communityDetail', postId],
    queryFn: async () => postId && (await getCommunityDetail(postId)),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
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
      onSuccessCb && onSuccessCb();
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
