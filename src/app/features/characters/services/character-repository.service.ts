import { Injectable, inject } from '@angular/core';
import { IRepository } from '../../../core/interfaces/repository.interface';
import {
  Character,
  ICharacterData,
} from '../../../shared/models/character.model';
import { PaginationParams } from '../../../shared/models/api-response.model';
import { IApiClient } from '../../../core/interfaces/api-client.interface';
import { ApiClientService } from '../../../core/services/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterRepositoryService implements IRepository<Character> {
  private readonly apiClient: IApiClient = inject(ApiClientService);

  async getAll(params?: PaginationParams): Promise<Character[]> {
    try {
      const response = await this.apiClient.get<ICharacterData>(
        '/characters',
        params
      );
      return response.characters?.map((data) => new Character(data)) || [];
    } catch (error) {
      console.error('Error fetching characters:', error);
      return [];
    }
  }

  async getById(id: number): Promise<Character> {
    try {
      const response = await this.apiClient.get<ICharacterData>(
        `/characters/${id}`
      );

      if (response) {
        return new Character(response as any);
      }
      throw new Error('Character not found');
    } catch (error) {
      console.error('Error fetching character:', error);
      throw error;
    }
  }

  async search(query: string, params?: PaginationParams): Promise<Character[]> {
    try {
      const searchParams = { ...params, name: query };
      const response = await this.apiClient.get<ICharacterData>(
        '/characters',
        searchParams
      );
      return response.characters?.map((data) => new Character(data)) || [];
    } catch (error) {
      console.error('Error searching characters:', error);
      return [];
    }
  }
}
