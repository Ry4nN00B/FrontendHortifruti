import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../../api/StockService';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

//Stock DTO
interface StockDTO {
    productId: string;
    amount: number;
    validity: Date;
}

@Component({
    selector: 'stockForm',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../HTML/StockForm.html',
    styleUrls: ['../CSS/StockForm.css']
})
export class StockForm {

    @Input() stock: StockDTO | null = null;
    @Output() closeModal = new EventEmitter<void>();
    @Output() stockCreate = new EventEmitter<void>();

    //Init DTO
    public stockDTO: StockDTO = {
        productId: '',
        amount: 0,
        validity: null as any
    };

    //Product's Information's
    products: Product[] = [];

    constructor(
        private stockService: StockService,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    //Loads Information's
    loadProducts(): void {
        this.productService.getProducts().subscribe(data => {
            this.products = data;
        });
    }

    //Save Stock
    saveStock() {
        this.stockDTO.validity = new Date(this.stockDTO.validity);

        this.stockService.saveStock(this.stockDTO as any).subscribe({
            next: (stockSave) => {
                console.log('Estoque salvo com sucesso:', stockSave);

                this.stockCreate.emit();
                this.closeModal.emit();
            },
            error: (err) => {
                console.error('Erro ao salvar fornecedor:', err);
            }
        });
    }
}