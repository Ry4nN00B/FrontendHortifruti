import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../api/auth.service'; // Importa o serviço de autenticação

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {

  // Injeta o Router e o AuthService
  constructor(private router: Router, private authService: AuthService) {}

  // Função para o botão Sair (visto no seu HTML em 00:51)
  logout(): void {
    this.authService.logout();
    // O AuthService (que vamos preencher) vai te redirecionar para /login
  }
}
