import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './APILink';
import { RegisterDTO, LoginDTO } from '../models/UserModel';

//Roles
export enum UserRole {
  GERENTE = 'GERENTE',
  ESTOQUISTA = 'ESTOQUISTA',
  OPERADOR = 'OPERADOR'
}

//Login DTO
interface LoginResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
  token: string;
}

//Logged DTO
interface LoggedUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  //Endpoint API
  private apiUrl = `${API_URL}/auth`;

  constructor(private router: Router, private http: HttpClient) { }

  //Login User
  login(dto: LoginDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => {


        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          roles: response.roles
        }));


      })
    );
  }

  //Register User
  register(dto: RegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, dto);
  }

  //Logout User
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  //List All Users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  //Get User Name By ID
  getUserMap(): Observable<{ [id: string]: string }> {
    return this.getAllUsers().pipe(
      map((users: any[]) => {
        const map: { [id: string]: string } = {};
        users.forEach(u => {
          map[u.id] = u.name;
        });
        return map;
      })
    );
  }

  //Get User
  getCurrentUser(): LoggedUser | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    return JSON.parse(userJson) as LoggedUser;
  }

  //Get Roles By User
  getUserRoles(): string[] {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    return user.roles ?? [];
  }

  //Check User Role's
  hasRole(role: UserRole): boolean {
    return this.getUserRoles().includes(role);
  }

  //Get Auth Token User
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  //Check If Token has Expired
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}
