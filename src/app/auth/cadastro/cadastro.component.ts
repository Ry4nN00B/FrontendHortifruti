import { Component, OnInit } from '@angular/core'; // Adicionado OnInit
import { Router, RouterModule } from '@angular/router'; // Adicionado RouterModule
import { CommonModule } from '@angular/common'; // IMPORTAR
import { FormsModule } from '@angular/forms';     // IMPORTAR

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule] 
})
export class CadastroComponent implements OnInit { // Implementa OnInit
  // Variáveis para o formulário
  name = ''; 
  email = '';
  password = '';

  constructor(private router: Router) {}

  // Adicionado o método ngOnInit obrigatório
  ngOnInit(): void {
  }

  onRegister(): void {
    // Lógica de cadastro (Mock)
    console.log('Usuário registrado (Mock):', this.name, this.email); // Agora funciona
    // Redireciona para o login após o cadastro
    this.router.navigate(['/login']);
  }
}