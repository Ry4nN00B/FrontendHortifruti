import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.models';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent implements OnInit {

  produtos: Product[] = [];
  
  // Variável para controlar o modal
  abrirModal: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.productService.getProducts().subscribe(
      (dadosRecebidos) => {
        this.produtos = dadosRecebidos;
        console.log('Produtos carregados (mock):', this.produtos);
      },
      (erro) => {
        console.error('Erro ao carregar produtos (mock)', erro);
      }
    );
  }

  // --- MÉTODOS PARA CONTROLAR O MODAL ---

  abrirModalAdicionarProduto(): void {
    this.abrirModal = true;
  }

  fecharModalAdicionarProduto(): void {
    this.abrirModal = false;
    // Opcional: Recarregar a lista de produtos após fechar
    this.carregarProdutos(); 
  }
}
