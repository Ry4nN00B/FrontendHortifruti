import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { Supplier } from '../models/supplier.model';
import { API_URL } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = `${API_URL}/suppliers`; 

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  saveSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}