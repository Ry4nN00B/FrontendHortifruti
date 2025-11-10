import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Category } from '../../models/CategoryModel';
import { CategoryService } from '../../api/CategoryService';
import { CategoryForm } from "../../forms/TypeScript/CategoryForm";

@Component({
  selector: 'categoryList',
  standalone: true,
  imports: [CommonModule, CategoryForm, FormsModule],
  templateUrl: '../HTML/CategoryList.html',
  styleUrls: ['../CSS/CategoryList.css']
})
export class CategoryList implements OnInit {

  @Output() categoryDelete = new EventEmitter<void>();

  //Category Information's
  categories: Category[] = [];
  selectedCategory: Category | null = null;

  //Pages Config
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  showModal = false;

  //Filter's
  filteredCategories: Category[] = [];

  showFilters = false;

  filters = {
    name: '',
    description: ''
  };

  //Messages
  statusMessage: string = '';
  statusType: 'success' | 'error' = 'success';

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  //Loads Information's
  loadCategorias(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
      this.filteredCategories = [...this.categories];

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
      description: ''
    };
    this.applyFilters();
  }

  applyFilters() {
    const f = this.filters;

    this.filteredCategories = this.categories.filter(c => {

      return (
        (!f.name || c.name?.toLowerCase().includes(f.name.toLowerCase())) &&
        (!f.description || c.description?.toLowerCase().includes(f.description.toLowerCase()))
      );

    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredCategories.length / this.pageSize));
  }

  //Modal Methods
  openCategoryAddModal(): void {
    this.selectedCategory = null;
    this.showModal = true;
  }

  closeCategoryAddModal(): void {
    this.showModal = false;
    this.loadCategorias();
  }

  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.showModal = true;
  }

  //Methods Category
  deleteCategory(id: string): void {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        console.log('Categoria deletada com sucesso.');

        this.onCategoryDelete();
        this.loadCategorias();
      },
      error: (err) => {
        console.error('Erro ao deletar categoria:', err);
      }
    });
  }

  //Messages
  clearMessageAfterDelay() {
    setTimeout(() => {
      this.statusMessage = '';
    }, 5000);
  }

  onCategoryCreate() {
    this.statusMessage = "Categoria criada com sucesso!";
    this.statusType = "success";
    this.clearMessageAfterDelay();
    this.loadCategorias();
  }

  onCategoryDelete() {
    this.statusMessage = "Categoria deletada com sucesso!";
    this.statusType = "error";
    this.clearMessageAfterDelay();
  }

  onCategorySaved() {
    this.statusMessage = "Categoria salva com sucesso!";
    this.statusType = "success";
    this.clearMessageAfterDelay();
    this.loadCategorias();
  }

  //Pagination Methods
  get categoriesPaginated(): Category[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories.slice(start, start + this.pageSize);
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
