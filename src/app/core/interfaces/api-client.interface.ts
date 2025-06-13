import { ApiResponse } from '../../shared/models/api-response.model';

export interface IApiClient {
  get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>>;
}
