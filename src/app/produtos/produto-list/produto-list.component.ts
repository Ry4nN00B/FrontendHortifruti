import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../api/product.service';
import { ProdutoFormComponent } from '../produto-form/produto-form.component';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ProdutoFormComponent]
})
export class ProdutoListComponent implements OnInit {
  // ... (código interno está ok, só adicionei os tipos) ...
  produtos: Product[] = [];
  abrirModal: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.productService.getProducts().subscribe(
      (dadosRecebidos: Product[]) => { 
        this.produtos = dadosRecebidos;
      },
      (erro: any) => {
        console.error('Erro ao carregar produtos (mock)', erro);
      }
    );
  }

  abrirModalAdicionarProduto(): void { this.abrirModal = true; }
  fecharModalAdicionarProduto(): void {
    this.abrirModal = false;
    this.carregarProdutos(); 
  }
}