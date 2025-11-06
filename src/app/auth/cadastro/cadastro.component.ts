import { Component, OnInit } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';     

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule] 
})
export class CadastroComponent implements OnInit { 
  name = ''; 
  email = '';
  password = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  onRegister(): void {
    // Lógica de cadastro (Mock)
    console.log('Usuário registrado (Mock):', this.name, this.email);
    this.router.navigate(['/login']);
  }
}