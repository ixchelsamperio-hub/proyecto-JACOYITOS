import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  auth = inject(Auth);
  router = inject(Router);

  form = { name: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', address: '' };
  error = signal('');
  loading = signal(false);

  async submit() {
    if (!this.form.name || !this.form.lastName || !this.form.email || !this.form.password || !this.form.address) {
      this.error.set('Por favor completa todos los campos obligatorios'); return;
    }
    if (this.form.password !== this.form.confirmPassword) {
      this.error.set('Las contraseñas no coinciden'); return;
    }
    if (this.form.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres'); return;
    }
    this.loading.set(true);
    const result = await this.auth.register(this.form);
    this.loading.set(false);
    if (result.ok) {
      this.router.navigate(['/']);
    } else {
      this.error.set(result.error || 'Error al registrarse');
    }
  }
}
