import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  auth.verificarSesion();

  if (auth.esAdmin()) {
    return true;
  }

  router.navigate(['/admin-login']);
  return false;
};