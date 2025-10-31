import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importa 'of' para retornar dados falsos
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS } from './data-mock'; // Importa os dados falsos

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  // Simula a chamada GET para /produtos
  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }

  // Simula a chamada POST para salvar
  saveProduct(product: Product): Observable<Product> {
    return of(product);
  }
}
