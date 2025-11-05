import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    // Chama o serviço Mock
    this.authService.login(this.email, this.password).subscribe(success => {
      if (success) {
        // Se o login (falso) funcionar, vai para o dashboard
        this.router.navigate(['/dashboard']); 
      } else {
        this.errorMessage = 'Email ou senha inválidos (Mock)';
      }
    });
  }
}