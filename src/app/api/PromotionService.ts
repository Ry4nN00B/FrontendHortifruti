import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './APILink';
import { Promotion } from '../models/PromotionModel';

@Injectable({ providedIn: 'root' })
export class PromotionService {

    //Endpoint API
    private apiUrl = `${API_URL}/promocoes`;

    constructor(private http: HttpClient) { }

    //List All Promotions
    getPromotions(): Observable<Promotion[]> {
        return this.http.get<Promotion[]>(this.apiUrl);
    }

    //Get Promotion By ID
    getPromotionByID(id: string): Observable<Promotion> {
        return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
    }

    //Save Promotion
    savePromotion(promotion: Promotion): Observable<Promotion> {
        return this.http.post<Promotion>(this.apiUrl, promotion);
    }

    //Update Promotion
    updatePromotion(id: string, promotion: Promotion): Observable<Promotion> {
        return this.http.put<Promotion>(`${this.apiUrl}/${id}`, promotion);
    }

    //Delete Promotion
    deletePromotion(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}