import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterService } from '../../services/character.service';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message';
import { LoadingComponent } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingComponent,
    ErrorMessageComponent,
  ],
  template: `
    <div class="character-detail-container">
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

      <!-- Character Detail -->
      <div
        class="character-detail"
        *ngIf="character() && !characterService.loading()"
      >
        <div class="detail-header">
          <button class="back-button" (click)="goBack()">← Voltar</button>
          <h1 class="character-name">{{ character()!.name }}</h1>
        </div>

        <div class="detail-content">
          <div class="character-image-section">
            <div class="main-image">
              <img
                [src]="character()!.primaryImage"
                [alt]="character()!.name"
                (error)="onImageError($event)"
              />
            </div>
            <div class="image-gallery" *ngIf="character()!.images.length > 1">
              <img
                *ngFor="let image of character()!.images.slice(1, 4)"
                [src]="image"
                [alt]="character()!.name"
                class="gallery-image"
                (error)="onImageError($event)"
              />
            </div>
          </div>

          <div class="character-info-section">
            <div class="info-grid">
              <!-- Informações Pessoais -->
              <div class="info-card">
                <h3 class="info-title">Informações Pessoais</h3>
                <div class="info-list">
                  <div
                    class="info-item"
                    *ngIf="character()!.personal?.birthdate"
                  >
                    <span class="label">Aniversário:</span>
                    <span class="value">{{
                      character()!.personal!.birthdate
                    }}</span>
                  </div>
                  <div class="info-item" *ngIf="character()!.personal?.sex">
                    <span class="label">Sexo:</span>
                    <span class="value">{{ character()!.personal!.sex }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Idade:</span>
                    <span class="value">{{ character()!.age }}</span>
                  </div>
                  <div
                    class="info-item"
                    *ngIf="character()!.personal?.bloodType"
                  >
                    <span class="label">Tipo Sanguíneo:</span>
                    <span class="value">{{
                      character()!.personal!.bloodType
                    }}</span>
                  </div>
                  <div class="info-item" *ngIf="character()!.personal?.clan">
                    <span class="label">Clã:</span>
                    <span class="value">{{ character()!.personal!.clan }}</span>
                  </div>
                </div>
              </div>

              <!-- Informações Ninja -->
              <div class="info-card">
                <h3 class="info-title">Informações Ninja</h3>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">Vila:</span>
                    <span class="value">{{ character()!.village }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Rank:</span>
                    <span class="value">{{ character()!.ninjaRank }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Classificação:</span>
                    <span class="value">{{ character()!.classification }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Ocupação:</span>
                    <span class="value">{{ character()!.occupation }}</span>
                  </div>
                  <div
                    class="info-item"
                    *ngIf="character()!.personal?.team?.length"
                  >
                    <span class="label">Time:</span>
                    <span class="value">{{
                      character()!.personal!.team!.join(', ')
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Habilidades -->
              <div
                class="info-card"
                *ngIf="
                  character()!.jutsu.length ||
                  character()!.natureType.length ||
                  character()!.tools.length
                "
              >
                <h3 class="info-title">Habilidades</h3>
                <div class="info-list">
                  <div class="info-item" *ngIf="character()!.natureType.length">
                    <span class="label">Natureza Chakra:</span>
                    <span class="value">{{
                      character()!.natureType.join(', ')
                    }}</span>
                  </div>
                  <div
                    class="info-item"
                    *ngIf="character()!.personal?.kekkeiGenkai?.length"
                  >
                    <span class="label">Kekkei Genkai:</span>
                    <span class="value">{{
                      character()!.personal!.kekkeiGenkai!.join(', ')
                    }}</span>
                  </div>
                  <div class="info-item" *ngIf="character()!.tools.length">
                    <span class="label">Ferramentas:</span>
                    <span class="value">{{
                      character()!.tools.slice(0, 3).join(', ')
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Família -->
              <div class="info-card" *ngIf="character()!.family && hasFamily()">
                <h3 class="info-title">Família</h3>
                <div class="info-list">
                  <div
                    class="info-item"
                    *ngFor="let relation of getFamilyRelations()"
                  >
                    <span class="label">{{ relation.relation }}:</span>
                    <span class="value">{{ relation.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Jutsus -->
            <div class="jutsu-section" *ngIf="character()!.jutsu.length">
              <h3 class="section-title">Jutsus Conhecidos</h3>
              <div class="jutsu-grid">
                <div
                  class="jutsu-item"
                  *ngFor="let jutsu of character()!.jutsu.slice(0, 12)"
                >
                  {{ jutsu }}
                </div>
              </div>
              <p class="jutsu-count" *ngIf="character()!.jutsu.length > 12">
                E mais {{ character()!.jutsu.length - 12 }} jutsus...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .character-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .detail-header {
        margin-bottom: 2rem;
      }

      .back-button {
        background: none;
        border: 2px solid #ff6b35;
        color: #ff6b35;
        padding: 0.5rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        transition: all 0.3s;
      }

      .back-button:hover {
        background-color: #ff6b35;
        color: white;
      }

      .character-name {
        font-size: 2.5rem;
        color: #333;
        margin: 0;
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .detail-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 3rem;
      }

      .character-image-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .main-image {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      .main-image img {
        width: 100%;
        height: 400px;
        object-fit: cover;
      }

      .image-gallery {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }

      .gallery-image {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s;
      }

      .gallery-image:hover {
        transform: scale(1.05);
      }

      .character-info-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .info-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #ff6b35;
      }

      .info-title {
        font-size: 1.2rem;
        color: #333;
        margin: 0 0 1rem 0;
        font-weight: 600;
      }

      .info-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .info-item:last-child {
        border-bottom: none;
      }

      .label {
        font-weight: 600;
        color: #666;
        min-width: 120px;
      }

      .value {
        color: #333;
        text-align: right;
        flex: 1;
        word-break: break-word;
      }

      .jutsu-section {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .section-title {
        font-size: 1.3rem;
        color: #333;
        margin: 0 0 1.5rem 0;
        font-weight: 600;
        border-bottom: 2px solid #ff6b35;
        padding-bottom: 0.5rem;
      }

      .jutsu-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.75rem;
      }

      .jutsu-item {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
        border: 1px solid #dee2e6;
        transition: all 0.3s;
      }

      .jutsu-item:hover {
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        color: white;
        transform: translateY(-2px);
      }

      .jutsu-count {
        text-align: center;
        color: #666;
        font-style: italic;
        margin-top: 1rem;
      }

      @media (max-width: 768px) {
        .character-detail-container {
          padding: 1rem 0.5rem;
        }

        .character-name {
          font-size: 2rem;
        }

        .detail-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .main-image img {
          height: 300px;
        }

        .jutsu-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
      }
    `,
  ],
})
export class CharacterDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly characterService = inject(CharacterService);

  readonly character = this.characterService.selectedCharacter;

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = Number(params['id']);
        if (id) {
          this.loadCharacter(id);
        }
      });
  }

  private async loadCharacter(id: number): Promise<void> {
    await this.characterService.loadCharacterById(id);
  }

  async retryLoad(): Promise<void> {
    this.characterService.clearError();
    const id = Number(this.route.snapshot.params['id']);
    if (id) {
      await this.loadCharacter(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/characters']);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/no-image.png';
  }

  hasFamily(): boolean {
    const family = this.character()?.family;
    return family ? Object.keys(family).length > 0 : false;
  }

  getFamilyRelations(): Array<{ relation: string; name: string }> {
    const family = this.character()?.family;
    if (!family) return [];

    return Object.entries(family).map(([relation, name]) => ({
      relation: this.translateRelation(relation),
      name,
    }));
  }

  private translateRelation(relation: string): string {
    const translations: Record<string, string> = {
      father: 'Pai',
      mother: 'Mãe',
      son: 'Filho',
      daughter: 'Filha',
      brother: 'Irmão',
      sister: 'Irmã',
      grandfather: 'Avô',
      grandmother: 'Avó',
      uncle: 'Tio',
      aunt: 'Tia',
      cousin: 'Primo(a)',
      wife: 'Esposa',
      husband: 'Marido',
    };

    return translations[relation.toLowerCase()] || relation;
  }
}
