import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '../../api/AuthService';

@Component({
  selector: 'app-main-layout',
  templateUrl: './MainLayout.html',
  styleUrls: ['./MainLayout.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class MainLayoutComponent {

  //User Information's
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  //Check User Have Roles
  canSee(roles: UserRole[]): boolean {
    return roles.some(r => this.authService.hasRole(r));
  }

  //Register User Page
  goToRegisterUser(): void {
    this.router.navigate(['/registrar']);
  }

  //Logout
  logout(): void {
    this.authService.logout();
  }
}
