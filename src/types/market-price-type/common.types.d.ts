export interface CommonResponse<T> {
  success?: boolean;
  data?: T;
  error?: Exception;
}

export interface Exception {
  message?: string;
  code?: string;
}
