import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductService } from '../api/product.service';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css']
})
export class EstoqueComponent implements OnInit {
  products: Product[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data.sort((a, b) => a.quantity - b.quantity);
      },
      (err) => {
        console.error('Erro ao carregar dados de estoque:', err);
      }
    );
  }
}