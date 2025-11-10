import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionService } from '../../api/PromotionService';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

//Promotion DTO
export interface PromotionDTO {
    id?: string;
    productId: string;
    type: string;
    value: number;
    startDate: Date;
    endDate: Date;
}

@Component({
    selector: 'promotionForm',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../HTML/PromotionForm.html',
    styleUrls: ['../CSS/PromotionForm.css']
})
export class PromotionForm implements OnInit {

    @Input() promotion: PromotionDTO | null = null;
    @Output() closeModal = new EventEmitter<void>();
    @Output() promotionCreate = new EventEmitter<void>();
    @Output() promotionSaved = new EventEmitter<void>();

    //Init DTO
    public promotionDTO: PromotionDTO = {
        productId: '',
        type: '',
        value: 0.0,
        startDate: null as any,
        endDate: null as any
    };

    public products: Product[] = [];

    constructor(
        private promotionService: PromotionService,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.loadProducts();

        if (this.promotion) {
            this.promotionDTO = { ...this.promotion };
        }
    }

    //Loads Information's
    loadProducts(): void {
        this.productService.getProducts().subscribe(data => {
            this.products = data;
        })
    }

    //Save Or Update Promotion
    savePromotion() {
        if (this.promotionDTO.id) {
            this.promotionService.updatePromotion(this.promotionDTO.id, this.promotionDTO as any).subscribe({
                next: (updatedPromotion) => {
                    console.log('Promoção atualizada com sucesso:', updatedPromotion);

                    this.promotionSaved.emit();
                    this.closeModal.emit();
                },
                error: (err) => {
                    console.error('Erro ao atualizar promoção:', err);
                }
            });
        } else {
            this.promotionService.savePromotion(this.promotionDTO as any).subscribe({
                next: (promotionSave) => {
                    console.log('Promoção salva com sucesso:', promotionSave);

                    this.promotionCreate.emit();
                    this.closeModal.emit();
                },
                error: (err) => {
                    console.error('Erro ao salvar promoção:', err);
                }
            });
        }
    }

    //Close Modal
    close() {
        this.closeModal.emit();
    }
}