import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  // Variáveis para o formulário
  nome = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  onRegister(): void {
    // Lógica de cadastro (Mock)
    console.log('Usuário registrado (Mock):', this.nome, this.email);
    // Redireciona para o login após o cadastro
    this.router.navigate(['/login']);
  }
}