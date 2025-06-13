import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../../shared/models/character.model';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="character-card" (click)="onCardClick()">
      <div class="card-image">
        <img
          [src]="character().primaryImage"
          [alt]="character().name"
          (error)="onImageError($event)"
          loading="lazy"
        />
      </div>
      <div class="card-content">
        <h3 class="character-name">{{ character().name }}</h3>
        <div class="character-info">
          <p class="info-item">
            <span class="info-label">Vila:</span>
            <span class="info-value">{{ character().village }}</span>
          </p>
          <p class="info-item">
            <span class="info-label">Rank:</span>
            <span class="info-value">{{ character().ninjaRank }}</span>
          </p>
          <p class="info-item" *ngIf="character().personal?.clan">
            <span class="info-label">Clã:</span>
            <span class="info-value">{{ character().personal?.clan }}</span>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .character-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .character-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }

      .card-image {
        height: 200px;
        overflow: hidden;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
      }

      .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .character-card:hover .card-image img {
        transform: scale(1.05);
      }

      .card-content {
        padding: 1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .character-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        margin: 0 0 0.5rem 0;
        text-align: center;
      }

      .character-info {
        flex: 1;
      }

      .info-item {
        margin: 0.3rem 0;
        font-size: 0.9rem;
        display: flex;
        justify-content: space-between;
      }

      .info-label {
        font-weight: 600;
        color: #666;
      }

      .info-value {
        color: #333;
        text-align: right;
        max-width: 60%;
        word-break: break-word;
      }
    `,
  ],
})
export class CharacterCardComponent {
  character = input.required<Character>();
  cardClick = output<Character>();

  onCardClick(): void {
    this.cardClick.emit(this.character());
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/no-image.png';
  }
}
