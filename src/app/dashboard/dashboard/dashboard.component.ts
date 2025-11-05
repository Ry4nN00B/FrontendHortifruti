import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../api/product.service'; // Puxa o serviço de produtos
import { SupplierService } from '../../api/supplier.service'; // Puxa o serviço de fornecedores
import { Product } from '../../models/product.model';
import { Supplier } from '../../models/supplier.model';
import { Observable, forkJoin } from 'rxjs'; // Usado para carregar múltiplos dados

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // --- Variáveis para os cards de Resumo ---
  totalVendas: number = 832; // (Mockado)
  faturamentoBruto: number = 18300; // (Mockado)
  
  quantidadeEmEstoque: number = 0;
  aReceber: number = 200; // (Mockado)
  
  totalFornecedores: number = 0;
  totalCategorias: number = 0; // (Mockado)

  // --- Variáveis para as Tabelas ---
  produtosMaisVendidos: any[] = []; // (Mockado)
  estoqueBaixo: Product[] = [];

  constructor(
    private productService: ProductService,
    private supplierService: SupplierService
  ) { }

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  carregarDadosDashboard() {
    // Usamos forkJoin para carregar produtos E fornecedores ao mesmo tempo
    forkJoin({
      produtos: this.productService.getProducts(),
      fornecedores: this.supplierService.getSuppliers()
    }).subscribe({
      next: (dados) => {
        // --- Processa os dados dos Produtos (Inventário) ---
        this.quantidadeEmEstoque = dados.produtos.reduce((acc, prod) => acc + prod.quantity, 0);
        
        // Filtra produtos com estoque baixo (Ex: menos que 15)
        this.estoqueBaixo = dados.produtos.filter(prod => prod.quantity < 15);

        // --- Processa os dados dos Fornecedores ---
        this.totalFornecedores = dados.fornecedores.length;
        
        // Mock de dados para o que não temos no mock
        this.produtosMaisVendidos = [
          { nome: 'Banana Prata', vendida: 30, restante: 12, preco: 'R$ 4,50' },
          { nome: 'Tomate Caqui', vendida: 21, restante: 15, preco: 'R$ 6,00' },
          { nome: 'Laranja Pêra', vendida: 19, restante: 17, preco: 'R$ 3,90' },
        ];
        
        this.totalCategorias = 5; // Valor mockado
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
      }
    });
  }

}

