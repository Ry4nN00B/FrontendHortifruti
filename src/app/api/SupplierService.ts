import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './APILink';
import { Supplier } from '../models/SupplierModel';

@Injectable({ providedIn: 'root' })
export class SupplierService {

  //Endpoint API
  private apiUrl = `${API_URL}/fornecedores`;

  constructor(private http: HttpClient) { }

  //List All Suppliers
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  //Get Supplier By ID
  getSupplirByID(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  //Save Supplier
  saveSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  //Update Supplier
  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  //Delete Supplier
  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}