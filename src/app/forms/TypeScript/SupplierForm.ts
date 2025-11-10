import { Component, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../api/SupplierService';

//Supplier DTO
interface SupplierDTO {
  id?: string;
  name: string;
  description: string;
  phoneNumber: string;
  email: string;
  cnpj: string;
}

@Component({
  selector: 'supplierForm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../HTML/SupplierForm.html',
  styleUrls: ['../CSS/SupplierForm.css']
})
export class SupplierForm {

  @Input() supplier: SupplierDTO | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() supplierCreate = new EventEmitter<void>();
  @Output() supplierSaved = new EventEmitter<void>();

  //Init DTO
  public supplierDTO: SupplierDTO = {
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    cnpj: ''
  };

  constructor(private supplierService: SupplierService) { }

  //Check If It's an Edit Or a Creation
  ngOnChanges(changes: SimpleChanges) {
    if (this.supplier) {
      this.supplierDTO = { ...this.supplier };
    } else {
      this.supplierDTO = { name: '', description: '', phoneNumber: '', email: '', cnpj: '' };
    }
  }

  //Save Or Update DTO
  saveSupplier() {
    if (this.supplierDTO.id) {
      this.supplierService.updateSupplier(this.supplierDTO.id, this.supplierDTO as any).subscribe({
        next: (updatedSupplier) => {
          console.log('Fornecedor atualizada com sucesso:', updatedSupplier);

          this.supplierSaved.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Erro ao atualizar fornecedor:', err);
        }
      });
    } else {
      this.supplierService.saveSupplier(this.supplierDTO as any).subscribe({
        next: (supplierSave) => {
          console.log('Fornecedor salvo com sucesso:', supplierSave);

          this.supplierCreate.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Erro ao salvar fornecedor:', err);
        }
      });
    }
  }

  //Close Modal
  close() {
    this.closeModal.emit();
  }
}