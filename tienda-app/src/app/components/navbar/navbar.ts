import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { Cart } from '../../services/cart';
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
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.cart.clear();
    this.router.navigate(['/']);
  }
}
