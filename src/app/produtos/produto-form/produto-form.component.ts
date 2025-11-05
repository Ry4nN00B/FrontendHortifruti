import { Component, EventEmitter, Output } from '@angular/core';
import { Product } from '../../models/product.models'; 
import { ProductService } from '../../services/product.service';

// Importações necessárias para Standalone Components com formulários
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produto-form',
   templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent {
  
  // Evento que avisa o 'produto-list' para fechar o modal
  @Output() closeModal = new EventEmitter<void>();

  // Objeto para armazenar os dados do formulário
  product: Product = {
    id: '', 
    name: '',
    price: 0,
    quantity: 0,
    validity: new Date(),
    qtoMinima: 10,
    category: '', // Adicionei 'category' aqui
  };

  constructor(private productService: ProductService) {}

  saveProduct() {
    console.log('Salvando produto (Mock):', this.product);
    

    this.closeModal.emit();
  }
}