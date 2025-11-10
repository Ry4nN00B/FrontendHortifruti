import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './APILink';
import { Sale } from '../models/SaleModel';

@Injectable({ providedIn: 'root' })
export class SaleService {

    //Endpoint API
    private apiUrl = `${API_URL}/vendas`;

    constructor(private http: HttpClient) { }

    //List All Sales
    getSales(): Observable<Sale[]> {
        return this.http.get<Sale[]>(this.apiUrl);
    }

    //Get Sale By ID
    getSaleById(id: string): Observable<Sale> {
        return this.http.get<Sale>(`${this.apiUrl}/${id}`);
    }

    //Create Sale
    createSale(sale: Sale): Observable<Sale> {
        return this.http.post<Sale>(this.apiUrl, sale);
    }

    //Update Sale
    updateSale(id: string, sale: Sale): Observable<Sale> {
        return this.http.put<Sale>(`${this.apiUrl}/${id}`, sale);
    }

    //Delete Sale
    deleteSale(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    //Confirm Sale
    confirmPayment(id: string): Observable<Sale> {
        return this.http.patch<Sale>(`${this.apiUrl}/${id}/confirmar`, {});
    }

    //Cancel Sale
    cancelSale(id: string): Observable<Sale> {
        return this.http.patch<Sale>(`${this.apiUrl}/${id}/cancelar`, {});
    }

    //Remove Item from Sale
    removeItem(id: string, productId: string): Observable<Sale> {
        return this.http.delete<Sale>(`${this.apiUrl}/${id}/item/${productId}`);
    }

}
