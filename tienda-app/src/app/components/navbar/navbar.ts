import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { Cart } from '../../services/cart';
import { OrderService } from '../../services/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  auth = inject(Auth);
  cart = inject(Cart);
  orderService = inject(OrderService);
  router = inject(Router);
  menuOpen = false;

  logout() {
    this.auth.logout();
    this.cart.clear();
    this.router.navigate(['/']);
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
}
