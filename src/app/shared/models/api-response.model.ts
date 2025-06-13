export interface ApiResponse<T> {
  characters?: T[];
  villages?: T[];
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
