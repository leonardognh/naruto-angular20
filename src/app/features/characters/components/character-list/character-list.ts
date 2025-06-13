import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../../../shared/models/character.model';
import { CharacterCardComponent } from '../character-card/character-card';
import { ErrorMessageComponent } from 'src/app/shared/components/error-message/error-message';
import { LoadingComponent } from 'src/app/shared/components/loading/loading';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CharacterCardComponent,
    LoadingComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="character-list-container">
      <div class="header">
        <h1 class="title">Explorando o Mundo Ninja</h1>
        <p class="subtitle">Descubra os personagens mais icônicos de Naruto</p>

        <div class="search-section">
          <div class="search-container">
            <input
              type="text"
              placeholder="Buscar personagem..."
              class="search-input"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput($event)"
              (keyup.enter)="performSearch()"
            />
            <button
              class="search-button"
              (click)="performSearch()"
              [disabled]="characterService.loading()"
            >
              🔍
            </button>
          </div>
          <button
            class="clear-button"
            (click)="clearSearch()"
            *ngIf="searchQuery.length > 0"
          >
            Limpar
          </button>
        </div>
      </div>

      <div class="content">
        <!-- Loading State -->
        <app-loading *ngIf="characterService.loading()"></app-loading>

        <!-- Error State -->
        <app-error-message
          *ngIf="characterService.error() && !characterService.loading()"
          [message]="characterService.error()!"
          [showRetry]="true"
          (retry)="retryLoad()"
        >
        </app-error-message>

        <!-- Empty State -->
        <div
          class="empty-state"
          *ngIf="
            !characterService.loading() &&
            !characterService.error() &&
            !characterService.hasCharacters()
          "
        >
          <h3>Nenhum personagem encontrado</h3>
          <p>Tente ajustar sua busca ou carregue todos os personagens.</p>
          <button class="load-all-button" (click)="loadAllCharacters()">
            Carregar Personagens
          </button>
        </div>

        <!-- Characters Grid -->
        <div
          class="characters-grid"
          *ngIf="
            characterService.hasCharacters() && !characterService.loading()
          "
        >
          <app-character-card
            *ngFor="
              let character of characterService.characters();
              trackBy: trackByCharacter
            "
            [character]="character"
            (cardClick)="onCharacterSelect($event)"
          >
          </app-character-card>
        </div>

        <!-- Results Info -->
        <div class="results-info" *ngIf="characterService.hasCharacters()">
          <p>Mostrando {{ characterService.characterCount() }} personagens</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .character-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .title {
        font-size: 2.5rem;
        color: #333;
        margin: 0 0 0.5rem 0;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        font-size: 1.1rem;
        color: #666;
        margin: 0 0 2rem 0;
      }

      .search-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .search-container {
        display: flex;
        gap: 0.5rem;
        width: 100%;
        max-width: 400px;
      }

      .search-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 2px solid #ddd;
        border-radius: 25px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s;
      }

      .search-input:focus {
        border-color: #ff6b35;
      }

      .search-button {
        padding: 0.75rem 1rem;
        background-color: #ff6b35;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
      }

      .search-button:hover:not(:disabled) {
        background-color: #e55a2b;
      }

      .search-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .clear-button {
        padding: 0.5rem 1rem;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.9rem;
      }

      .clear-button:hover {
        background-color: #5a6268;
      }

      .content {
        margin-top: 2rem;
      }

      .characters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
      }

      .empty-state h3 {
        margin-bottom: 1rem;
        color: #333;
      }

      .load-all-button {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background-color: #ff6b35;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
      }

      .load-all-button:hover {
        background-color: #e55a2b;
      }

      .results-info {
        text-align: center;
        color: #666;
        font-size: 0.9rem;
        padding: 1rem;
        border-top: 1px solid #eee;
      }

      @media (max-width: 768px) {
        .character-list-container {
          padding: 1rem 0.5rem;
        }

        .title {
          font-size: 2rem;
        }

        .characters-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
      }
    `,
  ],
})
export class CharacterListComponent implements OnInit {
  private readonly router = inject(Router);
  readonly characterService = inject(CharacterService);

  private readonly _searchQuery = signal('');

  ngOnInit(): void {
    this.loadAllCharacters();
  }

  get searchQuery(): string {
    return this._searchQuery();
  }

  set searchQuery(value: string) {
    this._searchQuery.set(value);
  }

  async loadAllCharacters(): Promise<void> {
    await this.characterService.loadCharacters({ page: 1 });
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this._searchQuery.set(query);
  }

  async performSearch(): Promise<void> {
    const query = this._searchQuery().trim();
    if (query) {
      await this.characterService.searchCharacters(query);
    } else {
      await this.loadAllCharacters();
    }
  }
  async clearSearch(): Promise<void> {
    this._searchQuery.set('');
    await this.loadAllCharacters();
  }

  async retryLoad(): Promise<void> {
    this.characterService.clearError();
    await this.loadAllCharacters();
  }

  onCharacterSelect(character: Character): void {
    this.router.navigate(['/characters', character.id]);
  }

  trackByCharacter(index: number, character: Character): number {
    return character.id;
  }
}
