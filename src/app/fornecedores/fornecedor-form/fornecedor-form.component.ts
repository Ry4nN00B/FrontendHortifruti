import { Component, EventEmitter, Output } from '@angular/core';
import { Supplier } from '../../models/supplier.models'; 
import { SupplierService } from '../../services/supplier.service';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css']
})
export class FornecedorFormComponent {
  
  
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

  
  saveSupplier(supplier: Supplier) {
    console.log('Salvando fornecedor (Mock):', supplier);

    // this.supplierService.saveSupplier(supplier).subscribe(() => {
    //   this.closeModal.emit(); 
    // });
    
    this.closeModal.emit();
  }
}
