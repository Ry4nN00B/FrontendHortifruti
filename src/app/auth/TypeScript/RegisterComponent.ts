import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../api/AuthService';

//Roles Enum
export enum UserRole {
  GERENTE = 'GERENTE',
  ESTOQUISTA = 'ESTOQUISTA',
  OPERADOR = 'OPERADOR'
}

//Register DTO
interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  roles: string[];
}

@Component({
  selector: 'authRegister',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../HTML/RegisterComponent.html',
  styleUrls: ['../CSS/RegisterComponent.css']
})
export class RegisterComponent implements OnInit {

  //Init DTO
  registerDTO: RegisterDTO = {
    name: '',
    email: '',
    password: '',
    roles: []
  };

  message = '';

  //Password Visibility
  passwordVisible = false;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void { }

  //Register Change Roles
  onRoleChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.checked) {
      if (!this.registerDTO.roles.includes(input.value)) {
        this.registerDTO.roles.push(input.value);
      }
    } else {
      this.registerDTO.roles = this.registerDTO.roles.filter(r => r !== input.value);
    }
  }

  //Register User Method
  onRegister(): void {
    if (!this.registerDTO.roles.length) {
      this.message = 'Selecione pelo menos um cargo.';
      return;
    }

    this.authService.register(this.registerDTO).subscribe({
      next: () => {
        console.log('Usuário registrado com sucesso:', this.registerDTO);
        this.router.navigate(['/dashboard']);
        this.message = 'Usuário registrado com sucesso!';
      },
      error: (err) => {
        console.error('Erro ao registrar usuário:', err);
        this.message = 'Erro ao registrar usuário. Verifique os dados.';
      }
    });
  }

  //Register Cancel
  onCancel() {
    this.router.navigate(['/dashboard']);
  }

  //Change Show Or Hide Password
  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
