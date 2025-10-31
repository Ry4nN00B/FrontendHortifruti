import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../api/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  faturamentoTotal = 18300; // Valor mockado para o HTML
  lucroTotal = 21390; // Valor mockado
  vendasMes = 17432; // Valor mockado
  
  // Lista para os produtos mais vendidos
  bestSellingProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    // Pega os produtos do Mock e filtra os mais vendidos (ex: 3 primeiros)
    this.productService.getProducts().subscribe(data => {
      // Apenas pega os 3 primeiros como exemplo para a tabela
      this.bestSellingProducts = data.slice(0, 3); 
    });
  }
}
