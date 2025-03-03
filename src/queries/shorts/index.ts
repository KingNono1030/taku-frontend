import { useMutation, useQuery } from '@tanstack/react-query';

import { formatSecondsToISODuration } from '@/lib/utils';
import {
  createShortsComment,
  createShortsCommentReply,
  deleteShortsComment,
  deleteShortsCommentReply,
  getShortsComment,
  recordShortsWatchTime,
  updateShortsComment,
  updateShortsCommentReply,
  uploadShorts,
} from '@/services/shorts';
import {
  CreateShortsCommentRequestBody,
  UpdateShortsCommentRequestBody,
  UploadShortsRequest,
} from '@/types/api/shorts.types';

type UseUploadShortsProps = {
  onSuccessCb?: () => void;
  onErrorCb?: () => void;
  onSettledCb?: () => void;
};

/**
 * 쇼츠 업로드 커스텀 훅
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useUploadShorts = ({
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseUploadShortsProps) => {
  return useMutation({
    mutationFn: async (requestBody: UploadShortsRequest) => {
      return uploadShorts(requestBody);
    },
    onSuccess: (data) => {
      // 요청 성공 시 실행할 로직
      console.log('쇼츠 업로드 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      // 요청 실패 시 실행할 로직
      console.error('쇼츠 업로드 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      // 요청 완료 후 (성공/실패 관계없이) 실행할 로직
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 쇼츠 댓글 조회 커스텀 훅
 * @param shortsId 쇼츠 ID
 */
export const useShortsComment = (shortsId: string) => {
  return useQuery({
    queryKey: ['shortsComments', shortsId],
    queryFn: async () => shortsId && (await getShortsComment(shortsId)),
    enabled: !!shortsId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

interface UseCreateShortsCommentProps {
  shortsId: string;
  onSuccessCb?: () => void;
  onErrorCb?: () => void;
  onSettledCb?: () => void;
}

/**
 * 쇼츠 댓글 등록 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param comment 댓글 내용
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useCreateShortsComment = ({
  shortsId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseCreateShortsCommentProps) => {
  return useMutation({
    mutationFn: async (requestBody: CreateShortsCommentRequestBody) => {
      return createShortsComment(shortsId, requestBody);
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

interface UseEditShortsCommentProps extends UseCreateShortsCommentProps {
  commentId: string;
}

/**
 * 쇼츠 댓글 수정 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useEditShortsComment = ({
  shortsId,
  commentId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseEditShortsCommentProps) => {
  return useMutation({
    mutationFn: async (requestBody: UpdateShortsCommentRequestBody) => {
      return updateShortsComment(shortsId, commentId, requestBody);
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
 * 쇼츠 댓글 삭제 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useDeleteShortsComment = ({
  shortsId,
  commentId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseEditShortsCommentProps) => {
  return useMutation({
    mutationFn: async () => {
      return deleteShortsComment(shortsId, commentId);
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
 * 쇼츠 대댓글 생성 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useCreateShortsCommentReply = ({
  shortsId,
  commentId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseEditShortsCommentProps) => {
  return useMutation({
    mutationFn: async (requestBody: CreateShortsCommentRequestBody) => {
      return createShortsCommentReply(shortsId, commentId, requestBody);
    },
    onSuccess: (data) => {
      console.log('대댓글 생성 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('대댓글 생성 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

interface UseEditShortsCommentReplyProps extends UseEditShortsCommentProps {
  replyId: string;
}

/**
 * 쇼츠 대댓글 수정 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param replyId 대댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useEditShortsCommentReply = ({
  shortsId,
  commentId,
  replyId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseEditShortsCommentReplyProps) => {
  return useMutation({
    mutationFn: async (requestBody: UpdateShortsCommentRequestBody) => {
      return updateShortsCommentReply(
        shortsId,
        commentId,
        replyId,
        requestBody,
      );
    },
    onSuccess: (data) => {
      console.log('대댓글 수정 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('대댓글 수정 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 쇼츠 대댓글 삭제 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param commentId 댓글 ID
 * @param replyId 대댓글 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useDeleteShortsCommentReply = ({
  shortsId,
  commentId,
  replyId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseEditShortsCommentReplyProps) => {
  return useMutation({
    mutationFn: async () => {
      return deleteShortsCommentReply(shortsId, commentId, replyId);
    },
    onSuccess: (data) => {
      console.log('대댓글 삭제 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('대댓글 삭제 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};

/**
 * 쇼츠 시청 시간 기록 커스텀 훅
 * @param shortsId 쇼츠 ID
 * @param onSuccessCb 성공 시 실행할 콜백 함수
 * @param onErrorCb 실패 시 실행할 콜백 함수
 * @param onSettledCb 완료 시 실행할 콜백 함수
 */
export const useRecordShortsWatchTime = ({
  shortsId,
  onSuccessCb,
  onErrorCb,
  onSettledCb,
}: UseCreateShortsCommentProps) => {
  return useMutation({
    mutationFn: async (requestBody: { viewTime: number; playTime: number }) => {
      // 시청 시간을 ISO 8601 기간 형식으로 변환
      const formatedRequestBody = {
        viewTime: formatSecondsToISODuration(requestBody.viewTime),
        playTime: formatSecondsToISODuration(requestBody.playTime),
      };

      return recordShortsWatchTime(shortsId, formatedRequestBody);
    },
    onSuccess: (data) => {
      console.log('시청 시간 기록 성공:', data);
      onSuccessCb && onSuccessCb();
    },
    onError: (error) => {
      console.error('시청 시간 기록 실패:', error);
      onErrorCb && onErrorCb();
    },
    onSettled: () => {
      onSettledCb && onSettledCb();
    },
  });
};
