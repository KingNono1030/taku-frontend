import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';

type PaginationComponentProps = {
  totalPages: number; // 총 페이지 수
  currentPage: number; // 현재 페이지
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; // 페이지 변경 함수
};

/**
 * 커스텀 페이지네이션 컴포넌트
 *
 * @param totalPages 총 페이지 수
 * @param currentPage 현재 페이지
 * @param setCurrentPage 페이지 변경 함수
 */
const PaginationComponent = ({
  totalPages = 10,
  currentPage,
  setCurrentPage,
}: PaginationComponentProps) => {
  /**
   * 페이지네이션을 생성하는 함수입니다.
   *
   * @returns {Array<number | string>} 페이지 번호와 'dots' 문자열이 포함된 배열을 반환합니다.
   *
   * @example
   * // currentPage가 5이고 totalPages가 10인 경우
   * // [1, 'dots', 4, 5, 6, 'dots', 10]을 반환합니다.
   *
   * @description
   * 이 함수는 현재 페이지를 기준으로 좌우로 delta 값만큼의 페이지 번호를 포함한 배열을 생성합니다.
   * 첫 페이지와 마지막 페이지는 항상 포함되며, 연속되지 않는 페이지 번호 사이에는 'dots' 문자열이 추가됩니다.
   */
  const generatePagination = () => {
    const delta = 3;
    const left = currentPage + 1 - delta;
    const right = currentPage + 1 + delta;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('dots');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = generatePagination();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={'ghost'}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'dots' ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem>
                <Button
                  variant={page === currentPage + 1 ? 'outline' : 'ghost'}
                  onClick={() => setCurrentPage((page as number) - 1)}
                >
                  {page}
                </Button>
              </PaginationItem>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant={'ghost'}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
