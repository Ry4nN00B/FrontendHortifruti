import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './APILink';
import { ValidityReport, StockReport, FinancialReport, HistoricalReport } from '../models/ReportModel';

@Injectable({ providedIn: 'root' })
export class ReportService {

  //Endpoint API
  private apiUrl = `${API_URL}/relatorios`;

  constructor(private http: HttpClient) { }

  //Get Financial Report
  getFinancialReport(): Observable<FinancialReport[]> {
    return this.http.get<FinancialReport[]>(`${this.apiUrl}/financeiro`);
  }

  //Get Estoque Report
  getStockReport(): Observable<StockReport[]> {
    return this.http.get<StockReport[]>(`${this.apiUrl}/estoque`);
  }

  //Get Validity Report
  getValidityReport(): Observable<ValidityReport[]> {
    return this.http.get<ValidityReport[]>(`${this.apiUrl}/vencendo`);
  }

  //Get Historial Report
  getSalesHistoryReport(): Observable<HistoricalReport[]> {
    return this.http.get<HistoricalReport[]>(`${this.apiUrl}/historico`);
  }

}