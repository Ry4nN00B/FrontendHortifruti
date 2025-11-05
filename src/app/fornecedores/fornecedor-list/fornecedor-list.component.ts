import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { SupplierService } from '../../api/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { FornecedorFormComponent } from '../fornecedor-form/fornecedor-form.component';

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FornecedorFormComponent]
})
export class FornecedorListComponent implements OnInit {
  
  fornecedores: Supplier[] = []; 
  showModal = false; 

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.fornecedores = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar fornecedores (MOCK FALHOU):', err);
      }
    });
  }
  
  abrirModalAdicionarFornecedor() {
    this.showModal = true;
  }
  
  fecharModalAdicionarFornecedor() {
    this.showModal = false;
    this.loadSuppliers(); 
  }
}