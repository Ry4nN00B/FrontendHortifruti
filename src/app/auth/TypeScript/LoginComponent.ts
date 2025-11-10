import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../api/AuthService';

//Login DTO
interface LoginDTO {
  email: string;
  password: string;
}

@Component({
  selector: 'authLogin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: '../HTML/LoginComponent.html',
  styleUrls: ['../CSS/LoginComponent.css']
})
export class LoginComponent implements OnInit {

  //Init DTO
  loginDTO: LoginDTO = {
    email: '',
    password: ''
  };

  errorMessage = '';

  //Password Visibility 
  passwordVisible = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  //Login User Method
  onLogin(): void {
    this.authService.login(this.loginDTO).subscribe({
      next: (response) => {
        console.log('Response do backend:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao logar:', err);
        this.errorMessage = 'Email ou senha inválidos';
      }
    });
  }

  //Change Show Or Hide Password
  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}
