import { Component, EventEmitter, Output } from '@angular/core';
import { Supplier } from '../../models/supplier.models'; 
import { SupplierService } from '../../services/supplier.service';

// Importações necessárias para Standalone Components com formulários
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true, // Define como um componente standalone
  imports: [
    CommonModule, // Necessário para *ngIf, *ngFor
    FormsModule   // Necessário para [(ngModel)]
  ],
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css']
})
export class FornecedorFormComponent {
  
  // Evento que avisa o 'fornecedor-list' para fechar o modal
  @Output() closeModal = new EventEmitter<void>();

  // Objeto para armazenar os dados do formulário
  supplier: Supplier = {
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    telefone: '',
    status: 'Ativo', // Valor padrão
    pendingDeliveries: 0 // Valor padrão
  };

  constructor(private supplierService: SupplierService) { }

  // Função chamada quando o formulário é enviado
  saveSupplier(supplier: Supplier) {
    console.log('Salvando fornecedor (Mock):', supplier);

    // this.supplierService.saveSupplier(supplier).subscribe(() => {
    //   this.closeModal.emit(); 
    // });
    
    this.closeModal.emit();
  }
}
