import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CLAVE_ADMIN = 'ecoseguro2025';
  private _esAdmin = signal<boolean>(false);
  readonly esAdmin = this._esAdmin.asReadonly();

  login(clave: string): boolean {
    if (clave === this.CLAVE_ADMIN) {
      this._esAdmin.set(true);
      sessionStorage.setItem('admin', 'true');
      return true;
    }
    return false;
  }

  logout() {
    this._esAdmin.set(false);
    sessionStorage.removeItem('admin');
  }

  verificarSesion() {
    if (sessionStorage.getItem('admin') === 'true') {
      this._esAdmin.set(true);
    }
  }
}