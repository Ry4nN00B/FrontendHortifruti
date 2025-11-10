import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Supplier } from '../../models/SupplierModel';
import { SupplierService } from '../../api/SupplierService';
import { SupplierForm } from "../../forms/TypeScript/SupplierForm";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'supplierList',
  templateUrl: '../HTML/SupplierList.html',
  styleUrls: ['../CSS/SupplierList.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SupplierForm, FormsModule]
})
export class SupplierList implements OnInit {

  @Output() supplierDelete = new EventEmitter<void>();

  //Supplier's Information's
  suppliers: Supplier[] = [];
  selectedSupplier: Supplier | null = null;

  showModal = false;

  //Pages Config
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  //Filter's
  filteredSuppliers: Supplier[] = [];

  showFilters = false;

  filters = {
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    cnpj: ''
  };

  //Messages
  statusMessage: string = '';
  statusType: 'success' | 'error' = 'success';

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  //Loads Information's
  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
      this.filteredSuppliers = [...this.suppliers];

      this.updatePagination();

      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    });
  }

  //Filter's Methods
  toggleFilters() {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.clearFilters();
    }
  }

  clearFilters() {
    this.filters = {
      name: '',
      description: '',
      phoneNumber: '',
      email: '',
      cnpj: ''
    };
    this.applyFilters();
  }

  applyFilters() {
    const f = this.filters;

    this.filteredSuppliers = this.suppliers.filter(s => {

      return (
        (!f.name || s.name?.toLowerCase().includes(f.name.toLowerCase())) &&
        (!f.description || s.description?.toLowerCase().includes(f.description.toLowerCase())) &&
        (!f.phoneNumber || s.phoneNumber?.toLowerCase().includes(f.phoneNumber.toLowerCase())) &&
        (!f.email || s.email?.toLowerCase().includes(f.email.toLowerCase())) &&
        (!f.cnpj || s.cnpj?.toLowerCase().includes(f.cnpj.toLowerCase()))
      );

    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredSuppliers.length / this.pageSize));
  }

  //Modal Methods
  openSupplierAddModal() {
    this.showModal = true;
  }

  closeSupplierAddModal() {
    this.showModal = false;
    this.loadSuppliers();
  }

  editSupplier(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.showModal = true;
  }

  //Methods Supplier
  deleteSupplier(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) {
      return;
    }

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        console.log('Fornecedor deletado com sucesso.');

        this.onSupplierDelete();
        this.loadSuppliers();
      },
      error: (err) => {
        console.error('Erro ao deletar fornecedor:', err);
      }
    });
  }

  //Messages
  clearMessageAfterDelay() {
    setTimeout(() => {
      this.statusMessage = '';
    }, 5000);
  }

  onSupplierCreate() {
    this.statusMessage = "Fornecedor criado com sucesso!";
    this.statusType = "success";
    this.clearMessageAfterDelay();
    this.loadSuppliers();
  }

  onSupplierDelete() {
    this.statusMessage = "Fornecedor deletado com sucesso!";
    this.statusType = "error";
    this.clearMessageAfterDelay();
  }
  
  onSupplierSaved() {
    this.statusMessage = "Fornecedor salvo com sucesso!";
    this.statusType = "success";
    this.clearMessageAfterDelay();
    this.loadSuppliers();
  }

  //Paginations Method's
  get suppliersPaginated(): Supplier[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSuppliers.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

}
