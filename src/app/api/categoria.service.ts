import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Categoria } from '../models/categoria.model';

const MOCK_CATEGORIAS: Categoria[] = [
  { id: 'c1', name: 'Frutas' },
  { id: 'c2', name: 'Vegetais' },
  { id: 'c3', name: 'Mercearia' }
];

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor() { }

  getCategorias(): Observable<Categoria[]> {
    return of(MOCK_CATEGORIAS);
  }

}