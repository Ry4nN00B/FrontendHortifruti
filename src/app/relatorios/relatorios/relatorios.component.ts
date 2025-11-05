import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../api/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RelatoriosComponent implements OnInit {

  faturamentoTotal = 18300; 
  lucroTotal = 21390; 
  vendasMes = 17432; 
  
  bestSellingProducts: any[] = []; 
  
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.bestSellingProducts = data.map(product => ({
        ...product,
        // Mock de faturamento (preço * 10) pois o mock não tem "vendidos"
        faturamento: product.price * 10 
      })).slice(0, 3);
    });
  }
}