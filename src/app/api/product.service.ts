import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS } from './data-mock'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  
  getProducts(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }

  
  saveProduct(product: Product): Observable<Product> {
    return of(product);
  }
}
