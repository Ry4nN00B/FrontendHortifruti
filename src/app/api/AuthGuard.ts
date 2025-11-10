import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, UserRole } from './AuthService';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  //Check If You Are Logged In
  if (!authService.isLoggedIn()) {
    console.warn('Acesso negado! Usuário não está logado.');
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles: UserRole[] = route.data['roles'] ?? [];

  //Retrieve the user's roles from localStorage.
  const userRoles: string[] = authService.getUserRoles();

  //Verify User Roles
  const hasRole = userRoles.some(role => allowedRoles.includes(role as UserRole));

  if (!hasRole) {
    console.log('Roles permitidas:', allowedRoles);
    console.log('Roles do usuário:', userRoles);
    console.warn('Acesso negado! Usuário não possui permissão.');
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
