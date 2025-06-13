import { Injectable, inject, signal, computed } from '@angular/core';
import { VillageRepositoryService } from './village-repository.service';
import { Village } from '../../../shared/models/village.model';
import { PaginationParams } from '../../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class VillageService {
  private readonly repository = inject(VillageRepositoryService);

  private readonly _villages = signal<Village[]>([]);
  private readonly _selectedVillage = signal<Village | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly villages = computed(() => this._villages());
  readonly selectedVillage = computed(() => this._selectedVillage());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  readonly hasVillages = computed(() => this._villages().length > 0);
  readonly villageCount = computed(() => this._villages().length);

  async loadVillages(params?: PaginationParams): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const villages = await this.repository.getAll(params);
      this._villages.set(villages);
    } catch (error) {
      this._error.set('Erro ao carregar vilas');
      console.error('Error loading villages:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async searchVillages(
    query: string,
    params?: PaginationParams
  ): Promise<void> {
    if (!query.trim()) {
      this._villages.set([]);
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      const villages = await this.repository.search(query, params);
      this._villages.set(villages);
    } catch (error) {
      this._error.set('Erro ao buscar vilas');
      console.error('Error searching villages:', error);
    } finally {
      this._loading.set(false);
    }
  }

  clearError(): void {
    this._error.set(null);
  }
}
