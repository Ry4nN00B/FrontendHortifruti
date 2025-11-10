import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../api/ProductService';

import { Category } from '../../models/CategoryModel';
import { CategoryService } from '../../api/CategoryService';

import { Supplier } from '../../models/SupplierModel';
import { SupplierService } from '../../api/SupplierService';

//Product DTO
export interface ProductDTO {
  id?: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  supplierId: string;
  soldByWeight: boolean;
}

@Component({
  selector: 'productForm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../HTML/ProductForm.html',
  styleUrls: ['../CSS/ProductForm.css']
})
export class ProductForm implements OnInit {

  @Input() product: ProductDTO | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() productCreate = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<void>();;

  //Init DTO
  public productDTO: ProductDTO = {
    name: '',
    description: '',
    price: 0.0,
    categoryId: '',
    supplierId: '',
    soldByWeight: false
  };

  public categories: Category[] = [];
  public suppliers: Supplier[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSupplier();

    if (this.product) {
      this.productDTO = { ...this.product };
    }
  }

  //Loads Information's
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
  loadSupplier(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    })
  }

  //Save Or Update Product
  saveProduct() {
    if (this.productDTO.id) {
      this.productService.updateProduct(this.productDTO.id, this.productDTO as any).subscribe({
        next: (productSave) => {
          console.log('Produto atualizado com sucesso:', productSave);

          this.productSaved.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
        }
      });
    } else {
      this.productService.saveProduct(this.productDTO as any).subscribe({
        next: (productSave) => {
          console.log('Produto criado com sucesso:', productSave);

          this.productCreate.emit();
          this.closeModal.emit();
        },
        error: (err) => {
          console.error('Erro ao criar produto:', err);
        }
      });
    }
  }

  //Close Modal
  close() {
    this.closeModal.emit();
  }
}