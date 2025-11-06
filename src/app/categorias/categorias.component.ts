import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Categoria } from '../models/categoria.model';
import { CategoriaService } from '../api/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.component.html', 
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit { 

  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }
}