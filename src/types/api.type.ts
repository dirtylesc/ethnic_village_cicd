export type ApiResponse<T = any> = {
  code: number;
  success: boolean;
  message: string;
  data?: T;
}

export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
}
