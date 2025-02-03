import { useMutation, useQuery } from '@tanstack/react-query';

import { getShortsComment, uploadShorts } from '@/services/shorts';
import { UploadShortsRequest } from '@/types/api/shorts.types';

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
