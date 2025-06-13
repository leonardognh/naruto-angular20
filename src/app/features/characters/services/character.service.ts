import { Injectable, inject, signal, computed } from '@angular/core';
import { CharacterRepositoryService } from './character-repository.service';
import { Character } from '../../../shared/models/character.model';
import { PaginationParams } from '../../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly repository = inject(CharacterRepositoryService);

  private readonly _characters = signal<Character[]>([]);
  private readonly _selectedCharacter = signal<Character | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly characters = computed(() => this._characters());
  readonly selectedCharacter = computed(() => this._selectedCharacter());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  readonly hasCharacters = computed(() => this._characters().length > 0);
  readonly characterCount = computed(() => this._characters().length);

  async loadCharacters(params?: PaginationParams): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const characters = await this.repository.getAll(params);
      this._characters.set(characters);
    } catch (error) {
      this._error.set('Erro ao carregar personagens');
      console.error('Error loading characters:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async loadCharacterById(id: number): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const character = await this.repository.getById(id);
      this._selectedCharacter.set(character);
    } catch (error) {
      this._error.set('Erro ao carregar personagem');
      console.error('Error loading character:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async searchCharacters(
    query: string,
    params?: PaginationParams
  ): Promise<void> {
    if (!query.trim()) {
      this._characters.set([]);
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    try {
      const characters = await this.repository.search(query, params);
      this._characters.set(characters);
    } catch (error) {
      this._error.set('Erro ao buscar personagens');
      console.error('Error searching characters:', error);
    } finally {
      this._loading.set(false);
    }
  }

  clearSelectedCharacter(): void {
    this._selectedCharacter.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }
}
