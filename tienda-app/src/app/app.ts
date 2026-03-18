import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <div class="app-wrapper">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>

    @if (auth.deliveryAlert()) {
      <div class="delivery-toast">
        <span class="toast-icon">🚚</span>
        <div>
          <strong>¡Tu pedido llegó!</strong>
          <p>{{ auth.deliveryAlert() }} ha sido entregado. ¡Buen provecho! 🌿</p>
        </div>
        <button (click)="auth.deliveryAlert.set(null)">✕</button>
      </div>
    }
  `,
  styles: [`
    .app-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
    .main-content { flex: 1; }
    .delivery-toast {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
      background: #fff; border: 1.5px solid #c8dfc0; border-left: 5px solid #2d6a2d;
      border-radius: 14px; padding: 1rem 1.2rem; display: flex; align-items: center; gap: 0.9rem;
      box-shadow: 0 8px 30px rgba(45,106,45,0.18); max-width: 320px;
      animation: slideIn 0.4s ease;
      .toast-icon { font-size: 2rem; flex-shrink: 0; }
      strong { display: block; color: #1a3a1a; font-size: 0.95rem; }
      p { color: #7a9a7a; font-size: 0.82rem; margin: 0; }
      button { background: transparent; border: none; color: #9ab89a; cursor: pointer;
        font-size: 1rem; padding: 0; margin-left: auto; flex-shrink: 0; align-self: flex-start; }
    }
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class App {
  auth = inject(Auth);
}