import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../api/supplier.service'; // Importa o serviço Mock
import { Supplier } from '../../models/supplier.model'; // Importa o modelo

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit {
  
  // Variável que guardará os dados e será usada no HTML (no *ngFor)
  fornecedores: Supplier[] = []; 
  
  // Variável para controlar a exibição do modal
  showModal = false; 

  // 1. Injeta o serviço no construtor
  constructor(private supplierService: SupplierService) { }

  // 2. O que fazer quando o componente é carregado
  ngOnInit(): void {
    this.loadSuppliers();
  }

  // 3. Função para buscar os dados do mock
  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.fornecedores = data; // Atribui os dados MOCK à lista
      },
      error: (err) => {
        console.error('Erro ao carregar fornecedores (MOCK FALHOU):', err);
        // Exibir uma mensagem de erro na tela, se houver
      }
    });
  }
  
  // 4. Funções para o Modal
  openAddSupplierModal() {
    this.showModal = true;
  }
  
  closeAddSupplierModal() {
    this.showModal = false;
    // Opcional: Recarregar a lista caso um novo fornecedor tenha sido adicionado
    // this.loadSuppliers(); 
  }
}