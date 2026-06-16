import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  clave = '';
  error = signal(false);
  cargando = signal(false);

  ingresar() {
    this.cargando.set(true);
    this.error.set(false);

    setTimeout(() => {
      const ok = this.auth.login(this.clave);
      if (ok) {
        this.router.navigate(['/admin']);
      } else {
        this.error.set(true);
        this.clave = '';
      }
      this.cargando.set(false);
    }, 600);
  }
}