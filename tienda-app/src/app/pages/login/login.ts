import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  auth = inject(Auth);
  router = inject(Router);

  email = '';
  password = '';
  error = signal('');
  loading = signal(false);

  async submit() {
    if (!this.email || !this.password) {
      this.error.set('Completa todos los campos'); return;
    }
    this.loading.set(true);
    this.error.set('');
    const ok = await this.auth.login(this.email, this.password);
    this.loading.set(false);
    if (ok) {
      this.router.navigate([this.auth.isAdmin() ? '/admin' : '/']);
    } else {
      this.error.set('Email o contraseña incorrectos');
    }
  }
}
