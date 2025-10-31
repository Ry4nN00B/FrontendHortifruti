import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Simula o Login
  login(email: string, pass: string): Observable<boolean> {
    // Lógica de login falsa (qualquer login funciona)
    if (email && pass) {
      localStorage.setItem('token', 'fake-token-123');
      return of(true);
    }
    return of(false);
  }

  // Simula o Logout
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
