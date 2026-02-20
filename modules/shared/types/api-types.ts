// Baseado no ApiResponse.php do Laravel
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

// Resposta paginada do backend
export type PaginatedData<T> = T & {
  total: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
};

export interface PaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}
