import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VillageService } from '../../services/village.service';
import { Village } from '../../../../shared/models/village.model';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message';
import { LoadingComponent } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-village-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, ErrorMessageComponent],
  template: `
    <div class="village-list-container">
      <div class="header">
        <h1 class="title">Vilas Ninja</h1>
        <p class="subtitle">Explore as vilas ocultas do mundo ninja</p>

        <div class="search-section">
          <div class="search-container">
            <input
              type="text"
              placeholder="Buscar vila..."
              class="search-input"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput($event)"
              (keyup.enter)="performSearch()"
            />
            <button
              class="search-button"
              (click)="performSearch()"
              [disabled]="villageService.loading()"
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
        <app-loading *ngIf="villageService.loading()"></app-loading>

        <!-- Error State -->
        <app-error-message
          *ngIf="villageService.error() && !villageService.loading()"
          [message]="villageService.error()!"
          [showRetry]="true"
          (retry)="retryLoad()"
        >
        </app-error-message>

        <!-- Empty State -->
        <div
          class="empty-state"
          *ngIf="
            !villageService.loading() &&
            !villageService.error() &&
            !villageService.hasVillages()
          "
        >
          <h3>Nenhuma vila encontrada</h3>
          <p>Tente ajustar sua busca ou carregue todas as vilas.</p>
          <button class="load-all-button" (click)="loadAllVillages()">
            Carregar Vilas
          </button>
        </div>

        <!-- Villages Grid -->
        <div
          class="villages-grid"
          *ngIf="villageService.hasVillages() && !villageService.loading()"
        >
          <div
            class="village-card"
            *ngFor="
              let village of villageService.villages();
              trackBy: trackByVillage
            "
          >
            <div class="card-header">
              <h3 class="village-name">{{ village.name }}</h3>
            </div>
            <div class="card-content">
              <div class="village-info">
                <p class="info-item">
                  <span class="info-label">Personagens:</span>
                  <span class="info-value">{{
                    village.characters.length
                  }}</span>
                </p>
                <div
                  class="characters-preview"
                  *ngIf="village.characters.length > 0"
                >
                  <p class="preview-title">Alguns personagens:</p>
                  <div class="character-tags">
                    <span
                      class="character-tag"
                      *ngFor="let character of village.characters.slice(0, 3)"
                    >
                      {{ character }}
                    </span>
                    <span
                      class="more-tag"
                      *ngIf="village.characters.length > 3"
                    >
                      +{{ village.characters.length - 3 }} mais
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info" *ngIf="villageService.hasVillages()">
          <p>Mostrando {{ villageService.villageCount() }} vilas</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .village-list-container {
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
        background: linear-gradient(135deg, #667eea, #764ba2);
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
        border-color: #667eea;
      }

      .search-button {
        padding: 0.75rem 1rem;
        background-color: #667eea;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
      }

      .search-button:hover:not(:disabled) {
        background-color: #5a67d8;
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

      .villages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .village-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s ease;
        border-left: 4px solid #667eea;
      }

      .village-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      .card-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        padding: 1rem;
        color: white;
      }

      .village-name {
        font-size: 1.3rem;
        font-weight: bold;
        margin: 0;
        text-align: center;
      }

      .card-content {
        padding: 1.5rem;
      }

      .village-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        margin: 0;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .info-label {
        font-weight: 600;
        color: #666;
      }

      .info-value {
        font-weight: bold;
        color: #333;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .characters-preview {
        margin-top: 1rem;
      }

      .preview-title {
        font-size: 0.9rem;
        color: #666;
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      .character-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .character-tag {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        color: #333;
        padding: 0.3rem 0.6rem;
        border-radius: 15px;
        font-size: 0.8rem;
        border: 1px solid #dee2e6;
      }

      .more-tag {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 0.3rem 0.6rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
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
        background-color: #667eea;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
      }

      .load-all-button:hover {
        background-color: #5a67d8;
      }

      .results-info {
        text-align: center;
        color: #666;
        font-size: 0.9rem;
        padding: 1rem;
        border-top: 1px solid #eee;
      }

      @media (max-width: 768px) {
        .village-list-container {
          padding: 1rem 0.5rem;
        }

        .title {
          font-size: 2rem;
        }

        .villages-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }
    `,
  ],
})
export class VillageListComponent implements OnInit {
  readonly villageService = inject(VillageService);

  private readonly _searchQuery = signal('');

  ngOnInit(): void {
    this.loadAllVillages();
  }

  get searchQuery(): string {
    return this._searchQuery();
  }

  set searchQuery(value: string) {
    this._searchQuery.set(value);
  }

  async loadAllVillages(): Promise<void> {
    await this.villageService.loadVillages({ page: 1 });
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this._searchQuery.set(query);
  }

  async performSearch(): Promise<void> {
    const query = this._searchQuery().trim();
    if (query) {
      await this.villageService.searchVillages(query);
    } else {
      await this.loadAllVillages();
    }
  }

  async clearSearch(): Promise<void> {
    this._searchQuery.set('');
    await this.loadAllVillages();
  }

  async retryLoad(): Promise<void> {
    this.villageService.clearError();
    await this.loadAllVillages();
  }

  trackByVillage(index: number, village: Village): number {
    return village.id;
  }
}
