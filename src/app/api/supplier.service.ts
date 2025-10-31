import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { MOCK_SUPPLIERS } from './data-mock'; // Importa os dados falsos

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor() { }

  // Simula a chamada GET para /fornecedores
  getSuppliers(): Observable<Supplier[]> {
    return of(MOCK_SUPPLIERS);
  }

  // Simula a chamada POST para salvar
  saveSupplier(supplier: Supplier): Observable<Supplier> {
    return of(supplier);
  }
}
