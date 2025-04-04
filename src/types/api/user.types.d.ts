import { operations } from './apiSchema.types';

export type OAuthProvider = 'KAKAO' | 'NAVER' | 'GOOGLE';

/**
 * path: '/api/user'
 */

/**
 * 유저 등록
 * @description 유저를 등록합니다.
 */

type RegisterUser = NonNullable<
  operations['registerUser']['requestBody']
>['content']['multipart/form-data'];
export interface RegisterUserRequest extends RegisterUser {
  profileImage?: File;
}
export type RegisterUserSuccessResponse =
  operations['registerUser']['responses'][201]['content']['*/*'];

/**
 * path: '/api/user/{userId}'
 */

/**
 * 유저 정보 조회
 * @description 유저 프로필, 닉네임, 성별, 나이대 조회
 */

export type FindUserDetailSuccessResponse =
  operations['findUserDetail']['responses'][200]['content']['*/*'];

export interface UserDetail
  extends NonNullable<FindUserDetailSuccessResponse['data']> {
  id: number;
  nickname: string;
}
export type UserDetailFromLogin = {
  user_id: number;
  is_black: boolean;
  user_role: 'USER' | 'ADMIN';
  profile_image: string;
  nickname: string;
};
/**
 * 유저 삭제
 * @description 유저 삭제
 */

export type DeleteUserSuccessResponse =
  operations['deleteUser']['responses'][200]['content']['*/*'];

/**
 * 유저 정보 수정
 * @description 유저 프로필, 닉네임 정보 수정
 */

export type EditUserRequest = NonNullable<
  operations['editUserDetail']['requestBody']
>['content']['multipart/form-data'];
export type EditUserSuccessResponse =
  operations['editUserDetail']['responses'][200]['content']['*/*'];

/**
 * path: '/api/user/nickname/{nickname}'
 */

/**
 * 닉네임 중복여부 확인
 * @description 닉네임 중복여부 확인
 */

export type CheckNicknameSuccessResponse =
  operations['checkNickname']['responses'][200]['content']['*/*'];
