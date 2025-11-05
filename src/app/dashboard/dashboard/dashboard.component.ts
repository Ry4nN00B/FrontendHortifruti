import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Observable, forkJoin } from 'rxjs';
import { ProductService } from '../../api/product.service';
import { SupplierService } from '../../api/supplier.service';
import { Product } from '../../models/product.model';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  
  totalVendas: number = 832;
  faturamentoBruto: number = 18300;
  quantidadeEmEstoque: number = 0;
  aReceber: number = 200;
  totalFornecedores: number = 0;
  totalCategorias: number = 0;
  produtosMaisVendidos: any[] = [];
  produtosComEstoqueBaixo: Product[] = []; 

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  carregarDadosDashboard() {
    forkJoin({
      produtos: this.productService.getProducts(),
      fornecedores: this.supplierService.getSuppliers()
    }).subscribe({
      next: (dados: any) => { 
        this.quantidadeEmEstoque = dados.produtos.reduce((acc: number, prod: any) => acc + prod.quantity, 0);
    
        this.produtosComEstoqueBaixo = dados.produtos.filter((prod: any) => prod.quantity < 15);
        
        this.totalFornecedores = dados.fornecedores.length;
        
        this.produtosMaisVendidos = [
          { nome: 'Banana Prata', vendida: 30, restante: 12, preco: 'R$ 4,50', faturamento: (30 * 4.5) },
          { nome: 'Tomate Caqui', vendida: 21, restante: 15, preco: 'R$ 6,00', faturamento: (21 * 6) },
          { nome: 'Laranja Pêra', vendida: 19, restante: 17, preco: 'R$ 3,90', faturamento: (19 * 3.9) },
        ];
        this.totalCategorias = 5;
      },
      error: (err: any) => { 
        console.error('Erro ao carregar dados do dashboard:', err);
      }
    });
  }
}