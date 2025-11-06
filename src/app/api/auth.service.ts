import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api.constants';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
interface UserMinDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
interface LoginResponse {
  token: string;
  user: UserMinDTO;
}


interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${API_URL}/auth`;
  
  constructor(private router: Router, private http: HttpClient) { }

  login(email: string, pass: string): Observable<LoginResponse> {
    const body = { email: email, password: pass };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body)
      .pipe(
        tap(response => {

          localStorage.setItem('token', response.token); 
          localStorage.setItem('userRole', response.user.role); 
        })
      );
  }

  register(dto: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); 
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): UserRole | null {
    return localStorage.getItem('userRole') as UserRole | null;
  }
}