import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../api/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { 
  email = '';
  password = '';
  errorMessage = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe((success: any) => {
      if (success) {
        this.router.navigate(['/dashboard']); 
      } else {
        this.errorMessage = 'Email ou senha inválidos (Mock)';
      }
    });
  }
}