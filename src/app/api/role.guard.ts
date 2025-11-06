import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';
export const roleGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService); 
  const router = inject(Router);
  const userRole = authService.getUserRole();

  if (userRole === UserRole.ADMIN) {
    return true;
  }


  console.warn('Acesso negado! Rota exclusiva para ADMINs.');
  router.navigate(['/dashboard']);
  return false;
};