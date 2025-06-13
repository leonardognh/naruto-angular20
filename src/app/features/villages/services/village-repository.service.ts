import { Injectable, inject } from '@angular/core';
import { IRepository } from '../../../core/interfaces/repository.interface';
import { Village, IVillageData } from '../../../shared/models/village.model';
import { PaginationParams } from '../../../shared/models/api-response.model';
import { IApiClient } from '../../../core/interfaces/api-client.interface';
import { ApiClientService } from '../../../core/services/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class VillageRepositoryService implements IRepository<Village> {
  private readonly apiClient: IApiClient = inject(ApiClientService);

  async getAll(params?: PaginationParams): Promise<Village[]> {
    try {
      const response = await this.apiClient.get<IVillageData>(
        '/villages',
        params
      );
      return response.villages?.map((data) => new Village(data)) || [];
    } catch (error) {
      console.error('Error fetching villages:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Village> {
    try {
      const response = await this.apiClient.get<IVillageData>(
        `/villages/${id}`
      );
      if (response.villages && response.villages.length > 0) {
        return new Village(response.villages[0]);
      }
      throw new Error('Village not found');
    } catch (error) {
      console.error('Error fetching village:', error);
      throw error;
    }
  }

  async search(query: string, params?: PaginationParams): Promise<Village[]> {
    try {
      const searchParams = { ...params, name: query };
      const response = await this.apiClient.get<IVillageData>(
        '/villages',
        searchParams
      );
      return response.villages?.map((data) => new Village(data)) || [];
    } catch (error) {
      console.error('Error searching villages:', error);
      return [];
    }
  }
}
