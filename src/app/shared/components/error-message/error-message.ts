import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container" *ngIf="message()">
      <div class="error-content">
        <h3 class="error-title">Ops! Algo deu errado</h3>
        <p class="error-message">{{ message() }}</p>
        <button class="retry-button" (click)="onRetry()" *ngIf="showRetry()">
          Tentar Novamente
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .error-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background-color: #ffe6e6;
        border: 1px solid #ffcccc;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .error-content {
        text-align: center;
      }

      .error-title {
        color: #d32f2f;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }

      .error-message {
        color: #666;
        margin-bottom: 1rem;
      }

      .retry-button {
        background-color: #ff6b35;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s;
      }

      .retry-button:hover {
        background-color: #e55a2b;
      }
    `,
  ],
})
export class ErrorMessageComponent {
  message = input.required<string>();
  showRetry = input<boolean>(false);
  retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
