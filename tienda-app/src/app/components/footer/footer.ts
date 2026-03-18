import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">🌿</span>
          <div>
            <h3>Jacoyitos</h3>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>Tienda</h4>
            <a routerLink="/">Inicio</a>
            <a routerLink="/cart">Mi carrito</a>
            <a routerLink="/profile">Mi perfil</a>
          </div>
          <div class="footer-col">
            <h4>Contacto</h4>
            <span>📞 Tel: 771 789 4539 </span>
            <span>  &#64;Jacoyitos.com</span>
            <span>📍 Floyan Jimenez #108 </span>
          </div>
          <div class="footer-col">
            <h4>Horario</h4>
            <span>Lun - Vie: 8am - 8pm</span>
            <span>Sábado: 9am - 6pm</span>
            <span>Domingo: 10am - 4pm</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Jacoyitos · Todos los derechos reservados</span>
        <span>Hecho con 🌿 y mucho amor</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: #1a3a1a;
        color: #a8c8a8;
        margin-top: auto;
      }
      .footer-inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 3rem 1.5rem 2rem;
        display: flex;
        gap: 3rem;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .footer-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        .footer-logo {
          font-size: 2.5rem;
        }
        h3 {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 900;
          margin: 0 0 0.2rem;
        }
        p {
          color: #6a9a6a;
          font-size: 0.85rem;
          margin: 0;
        }
      }
      .footer-links {
        display: flex;
        gap: 3rem;
        flex-wrap: wrap;
      }
      .footer-col {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        h4 {
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          margin: 0 0 0.3rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        a,
        span {
          color: #6a9a6a;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
          &:hover {
            color: #a8c8a8;
          }
        }
      }
      .footer-bottom {
        border-top: 1px solid #2d5a2d;
        padding: 1.2rem 1.5rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
        max-width: 1200px;
        margin: 0 auto;
        font-size: 0.8rem;
        color: #4a7a4a;
      }
      @media (max-width: 640px) {
        .footer-inner {
          flex-direction: column;
          gap: 2rem;
        }
        .footer-links {
          gap: 1.5rem;
        }
        .footer-bottom {
          justify-content: center;
          text-align: center;
        }
      }
    `,
  ],
})
export class Footer {}
