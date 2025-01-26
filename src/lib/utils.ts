import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 'cn' 함수는 여러 클래스를 받아서, 불필요한 중복 클래스를 제거하고 합친 결과를 반환합니다.
 *
 * @param inputs - 동적으로 추가될 클래스의 목록입니다.
 * @returns 최적화된 Tailwind CSS 클래스 문자열
 *
 * - `clsx`: 조건에 따라 클래스를 동적으로 추가하거나 제거하는 함수입니다.
 * - `twMerge`: Tailwind CSS에서 중복된 클래스를 병합하여 더 효율적인 클래스를 반환하는 함수입니다.
 * - 두 함수를 결합하여 최종적으로 중복을 제거하고 필요한 클래스만 반환합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자를 한국 통화 형식으로 변환하여 반환합니다.
 *
 * @param {number} amount - 변환할 숫자 값.
 * @returns {string} - "###,###원" 형식의 문자열.
 *
 * 설명:
 * - `toLocaleString('ko-KR')`를 사용하여 숫자를 한국어 지역화 형식으로 변환합니다.
 *   - 3자리마다 쉼표(,)를 추가하는 작업 포함.
 * - 변환된 숫자에 "원"을 추가하여 최종 형식을 완성합니다.
 *
 * 사용 예:
 * formatCurrency(70000);  // "70,000원"
 * formatCurrency(1234567); // "1,234,567원"
 * formatCurrency(500);    // "500원"
 */
export function formatCurrency(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

const KILO = 1000;
const MILL = 1000000;
/**
 * 숫자를 크기에 따라 K(천 단위) 또는 M(백만 단위) 형식으로 변환합니다.
 *
 * @param {number} amount - 변환할 숫자 값.
 * @returns {string} - 변환된 형식의 문자열.
 *
 * 설명:
 * - 천 단위(1,000 이상)에서는 숫자 뒤에 'K'를 추가합니다.
 * - 백만 단위(1,000,000 이상)에서는 숫자 뒤에 'M'을 추가합니다.
 * - 해당하지 않는 숫자는 그대로 반환합니다.
 *
 * formatLargeNumber(700);      // "700"
 * formatLargeNumber(1500);     // "1.5K"
 * formatLargeNumber(2000000);  // "2M"
 */
export function formatLargeNumber(amount: number) {
  if (amount < KILO) return amount.toString();
  if (amount < MILL) return `${(amount / KILO).toFixed(1)}K`;
  return `${(amount / MILL).toFixed(1)}M`;
}

/**
 * 현재 페이지의 URL을 클립보드에 복사하는 함수.
 *
 * @async
 * @function handleShare
 * @returns {Promise<void>} - 성공적으로 클립보드에 복사되었는지 여부.
 *
 * 설명:
 * - 현재 페이지의 URL을 가져와 클립보드에 복사합니다.
 * - 복사 성공 시 사용자에게 알림을 표시합니다.
 * - 실패 시 에러를 콘솔에 출력하고 사용자에게 알림을 표시합니다.
 *
 * 예외 처리:
 * - `navigator.clipboard` API 사용이 실패하면 에러 메시지를 표시합니다.
 */
export const shareCurrentURL = async () => {
  try {
    const currentUrl = window.location.href; // 현재 URL 가져오기
    await navigator.clipboard.writeText(currentUrl); // 클립보드에 복사
    alert('URL이 클립보드에 복사되었습니다!'); // 성공 알림
  } catch (error) {
    console.error('URL 복사에 실패했습니다.', error);
    alert('URL 복사에 실패했습니다. 다시 시도해주세요.');
  }
};

const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;
const DAYS_IN_A_WEEK = 7;
const WEEKS_IN_A_MONTH = 4.34524; // 평균 주 수 (1년을 12로 나눈 주)
const MONTHS_IN_A_YEAR = 12;

/**
 * 주어진 날짜 문자열을 한국식 날짜 형식으로 변환하거나,
 * 경과 시간을 초, 분, 시간, 일, 주, 월 단위로 표시하는 함수.
 *
 * @function formatKoreanDate
 * @returns {string} - 변환된 한국식 날짜 문자열 또는 경과 시간.
 * @param {string} dateString - "YYYY.MM.DD" 형식의 날짜 문자열.
 *
 * 설명:
 * - 초, 분, 시간, 일, 주, 월 단위로 경과 시간을 반환합니다.
 * - 1년 이상일 경우 "YY년 MM월 DD일 HH시 MM분" 형식의 날짜를 반환합니다.
 *
 * 예제:
 * ```
 * formatKoreanDate("2025-01-17 11:49"); // "25.01.17" 또는 "23시간 전"
 * ```
 *
 * 주의:
 * - dateString은 반드시 ISO 형식의 유효한 날짜 문자열이어야 합니다.
 * - 유효하지 않은 dateString이 입력되면 `Invalid Date` 에러가 발생합니다.
 */
export const formatKoreanDate = (dateString: string): string => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const timeDifference = now.getTime() - targetDate.getTime();

  // 초, 분, 시간, 일, 주, 월 단위 계산
  const seconds = Math.floor(timeDifference / MILLISECONDS_IN_A_SECOND);
  const minutes = Math.floor(seconds / SECONDS_IN_A_MINUTE);
  const hours = Math.floor(minutes / MINUTES_IN_AN_HOUR);
  const days = Math.floor(hours / HOURS_IN_A_DAY);
  const weeks = Math.floor(days / DAYS_IN_A_WEEK);
  const months = Math.floor(weeks / WEEKS_IN_A_MONTH);

  // 경과 시간 표시
  if (seconds < SECONDS_IN_A_MINUTE) {
    return `${seconds}초 전`;
  } else if (minutes < MINUTES_IN_AN_HOUR) {
    return `${minutes}분 전`;
  } else if (hours < HOURS_IN_A_DAY) {
    return `${hours}시간 전`;
  } else if (days < DAYS_IN_A_WEEK) {
    return `${days}일 전`;
  } else if (weeks < WEEKS_IN_A_MONTH) {
    return `${weeks}주 전`;
  } else if (months < MONTHS_IN_A_YEAR) {
    return `${months}개월 전`;
  }

  // 1년 이상이면 한국식 날짜 포맷으로 변환
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  return `${year}.${month.toString().padStart(2, '0')}.${day
    .toString()
    .padStart(2, '0')}`;
};
