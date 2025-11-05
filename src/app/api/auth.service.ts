import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importa o 'tap'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Função de Login (Corrigida para usar localStorage)
  login(email: string, pass: string): Observable<boolean> {
    // Lógica de login (mock)
    if (email && pass) {
      // Se o login for válido, salva no localStorage e retorna true
      return of(true).pipe(
        tap(() => localStorage.setItem('isLoggedIn', 'true'))
      );
    }
    // Se for inválido, apenas retorna false
    return of(false);
  }

  // Função de Logout (Corrigida para limpar o localStorage)
  logout(): void {
    localStorage.removeItem('isLoggedIn'); // <-- CORRIGIDO
    this.router.navigate(['/login']);
  }

  // --- FUNÇÃO ADICIONADA ---
  // Necessária para o AuthGuard funcionar
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
