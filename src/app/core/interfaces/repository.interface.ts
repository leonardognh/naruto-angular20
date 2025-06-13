import { PaginationParams } from '../../shared/models/api-response.model';

export interface IRepository<T> {
  getAll(params?: PaginationParams): Promise<T[]>;
  getById(id: number): Promise<T>;
  search(query: string, params?: PaginationParams): Promise<T[]>;
}
