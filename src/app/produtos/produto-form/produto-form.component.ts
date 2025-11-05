import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../api/product.service';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProdutoFormComponent {
  @Output() closeModal = new EventEmitter<void>();
  product: Product = {
    id: '', 
    name: '',
    price: 0,
    quantity: 0,
    validity: new Date(),
    qtoMinima: 10,
    category: '',
  };

  constructor(private productService: ProductService) {}

  saveProduct() {
    console.log('Salvando produto (Mock):', this.product);
    this.closeModal.emit();
  }
}