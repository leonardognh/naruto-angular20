import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">
            <span class="brand-text">Naruto Explorer</span>
          </a>
        </div>

        <div class="nav-menu">
          <a
            routerLink="/characters"
            routerLinkActive="active"
            class="nav-link"
          >
            Personagens
          </a>
          <a routerLink="/villages" routerLinkActive="active" class="nav-link">
            Vilas
          </a>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .navbar {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
      }

      .nav-brand {
        display: flex;
        align-items: center;
      }

      .brand-link {
        text-decoration: none;
        color: white;
      }

      .brand-text {
        font-size: 1.5rem;
        font-weight: bold;
        background: linear-gradient(45deg, #ff6b35, #f7931e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
      }

      .nav-menu {
        display: flex;
        gap: 2rem;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        transition: all 0.3s ease;
        position: relative;
      }

      .nav-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .nav-link.active {
        background-color: rgba(255, 107, 53, 0.8);
        box-shadow: 0 4px 8px rgba(255, 107, 53, 0.3);
      }

      @media (max-width: 768px) {
        .navbar {
          padding: 1rem;
        }

        .brand-text {
          font-size: 1.2rem;
        }

        .nav-menu {
          gap: 1rem;
        }

        .nav-link {
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class HeaderComponent {}
