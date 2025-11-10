import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './APILink';
import { Stock } from '../models/StockModel';

@Injectable({ providedIn: 'root' })
export class StockService {

  //Endpoint API
  private apiUrl = `${API_URL}/estoque`;

  constructor(private http: HttpClient) { }

  //List All Stock
  getStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  //Get Stock By ID
  getStockByID(id: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/${id}`);
  }

  //Get Stock for Product By ID
  getStockProductByID(productId: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/produto/${productId}`);
  }

  //Save Supplier
  saveStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  //Delete Stock
  deleteStock(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  //Low Stock
  getLowStock(minAmount: number): Observable<Stock[]> {
    const params = new HttpParams().set('minAmount', minAmount);
    return this.http.get<Stock[]>(`${this.apiUrl}/estoque-baixo`, { params });
  }

  //Products Near Expiration
  getNearExpiration(days: number): Observable<Stock[]> {
    const params = new HttpParams().set('days', days);
    return this.http.get<Stock[]>(`${this.apiUrl}/proximos-a-vencer`, { params });
  }

  //Clean Empty Stock
  cleanEmptyStock(): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/limpar-lotes-vazios`);
  }

}