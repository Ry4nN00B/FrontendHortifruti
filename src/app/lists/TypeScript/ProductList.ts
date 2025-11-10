import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';
import { ProductForm } from "../../forms/TypeScript/ProductForm";

import { Category } from '../../models/CategoryModel';
import { CategoryService } from '../../api/CategoryService';

import { Supplier } from '../../models/SupplierModel';
import { SupplierService } from '../../api/SupplierService';

@Component({
  selector: 'productList',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductForm, FormsModule],
  templateUrl: '../HTML/ProductList.html',
  styleUrl: '../CSS/ProductList.css'
})
export class ProductList implements OnInit {

  @Output() productDelete = new EventEmitter<void>();

  //Product Information's
  products: Product[] = [];
  selectedProduct: Product | null = null;

  showModal: boolean = false;

  //Category Information's
  categories: Category[] = [];
  categoryMap = new Map<string, string>();

  //Supplier Information's
  suppliers: Supplier[] = [];
  supplierMap = new Map<string, string>();

  //Pages Config
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  //Filters
  filteredProducts: Product[] = [];

  showFilters = false;

  filters = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    supplierId: '',
    soldByWeight: ''
  };

  //Messages
  statusMessage: string = '';
  statusType: 'success' | 'error' = 'success';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSuppliers();
  }


  //Loads Information's
  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = [...this.products];

      this.updatePagination();

      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      this.categoryMap = new Map(data.map(c => [c.id, c.name]));
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
      this.supplierMap = new Map(data.map(s => [s.id, s.name]));
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
      price: '',
      categoryId: '',
      supplierId: '',
      soldByWeight: ''
    };
    this.applyFilters();
  }

  applyFilters() {
    const f = this.filters;

    this.filteredProducts = this.products.filter(p => {

      const categoryName = this.categoryMap.get(p.categoryId) ?? "";
      const supplierName = this.supplierMap.get(p.supplierId) ?? "";

      return (
        (!f.name || p.name?.toLowerCase().includes(f.name.toLowerCase())) &&
        (!f.description || p.description?.toLowerCase().includes(f.description.toLowerCase())) &&
        (!f.price || p.price?.toString().includes(f.price)) &&
        (!f.categoryId || categoryName.toLowerCase().includes(f.categoryId.toLowerCase())) &&
        (!f.supplierId || supplierName.toLowerCase().includes(f.supplierId.toLowerCase())) &&
        (!f.soldByWeight || String(p.soldByWeight) === f.soldByWeight)
      );
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  //Modal Methods
  openProductAddModal() {
    this.selectedProduct = null;
    this.showModal = true;
  }

  closeProductAddModal() {
    this.showModal = false;
    this.loadProducts();
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  //Methods Product
  deleteProduct(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        console.log('Produto deletado com sucesso.');

        this.onProductDelete();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Erro ao deletar produto:', err);
      }
    });
  }

  //Messages
  clearMessageAfterDelay() {
    setTimeout(() => {
      this.statusMessage = '';
    }, 5000);
  }

  onProductCreate() {
    this.statusMessage = "Produto criado com sucesso!";
    this.statusType = "success";
    this.clearMessageAfterDelay();
    this.loadProducts();
  }

  onProductDelete() {
    this.statusMessage = "Produto deletado com sucesso!";
    this.statusType = "error";
    this.clearMessageAfterDelay();
  }

  onProductSaved() {
    this.statusMessage = "Produto salvo com sucesso!";
    this.statusType = "success";
    this.clearMessageAfterDelay();
    this.loadProducts();
  }

  //Pagination Methods
  get productsPaginated(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
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
