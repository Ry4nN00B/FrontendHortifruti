import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { MOCK_SUPPLIERS } from './data-mock'; 

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor() { }

  
  getSuppliers(): Observable<Supplier[]> {
    return of(MOCK_SUPPLIERS);
  }

  saveSupplier(supplier: Supplier): Observable<Supplier> {
    return of(supplier);
  }
}
