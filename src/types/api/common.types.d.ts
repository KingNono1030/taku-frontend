import { operations } from './apiSchema.types';

/**
 * path: '/file/download/{fileName}'
 */

/**
 * 파일 다운로드
 * @description 파일을 스토리지에서 다운로드합니다.
 */

export type DownloadFileSuccessResponse =
  operations['downloadFile']['responses'][200]['content']['*/*'];

/**
 * path: '/file/upload'
 */

/**
 * 파일 업로드
 * @description 파일을 스토리지에 업로드합니다.
 */

export type UploadFileRequest = NonNullable<
  operations['uploadFile']['requestBody']
>['content']['multipart/form-data'];
export type UploadFileSuccessResponse =
  operations['uploadFile']['responses'][200]['content']['*/*'];
