import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService, UserRole } from './AuthService';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: UserRole[] = route.data['roles'] ?? [];
  const userRoles: string[] = authService.getUserRoles();

  const hasRole = userRoles.some(role => allowedRoles.includes(role as UserRole));

  if (!hasRole) {
    console.warn('Acesso negado! Usuário não possui permissão.');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
