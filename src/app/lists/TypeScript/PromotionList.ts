import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Promotion } from '../../models/PromotionModel';
import { PromotionService } from '../../api/PromotionService';
import { PromotionForm } from '../../forms/TypeScript/PromotionForm';

import { Product } from '../../models/ProductModel';
import { ProductService } from '../../api/ProductService';

@Component({
    selector: 'promotionList',
    standalone: true,
    imports: [CommonModule, RouterModule, PromotionForm, FormsModule],
    templateUrl: '../HTML/PromotionList.html',
    styleUrls: ['../CSS/PromotionList.css']
})
export class PromotionList implements OnInit {

    @Output() productDelete = new EventEmitter<void>();
    
    //Promotion Information's
    promotions: Promotion[] = [];
    selectedPromotion: Promotion | null = null;

    showModal: boolean = false;

    promotionTypeMap: { [key: string]: string } = {
        FIXED_VALUE: 'Valor Fixo',
        PERCENT: 'Porcentagem'
    };

    //Product Information's
    products: Product[] = [];
    productMap = new Map<string, string>();

    //Pages Config
    pageSize = 10;
    currentPage = 1;
    totalPages = 1;

    //Filter's
    filteredPromotions: Promotion[] = [];

    showFilters = false;

    filters = {
        productId: '',
        type: '',
        value: '',
        startDate: '',
        endDate: ''
    };

    //Messages
    statusMessage: string = '';
    statusType: 'success' | 'error' = 'success';

    constructor(
        private promotionSevice: PromotionService,
        private productService: ProductService
    ) { }

    ngOnInit(): void {
        this.loadPromotions();
        this.loadProducts();
    }


    //Loads Promotion's 
    loadPromotions(): void {
        this.promotionSevice.getPromotions().subscribe(data => {
            this.promotions = data;
            this.filteredPromotions = [...this.promotions];

            this.updatePagination();

            if (this.currentPage > this.totalPages) {
                this.currentPage = this.totalPages;
            }
        });
    }
    loadProducts(): void {
        this.productService.getProducts().subscribe(data => {
            this.products = data;
            this.productMap = new Map(data.map(p => [p.id, p.name]));
        });
    }

    //Filter's Methods
    toggleFilters() {
        this.showFilters = !this.showFilters;
        if (!this.showFilters) {
            this.clearFilters();
        }
    }

    clearFilters() {
        this.filters = {
            productId: '',
            type: '',
            value: '',
            startDate: '',
            endDate: ''
        };
        this.applyFilters();
    }

    applyFilters() {
        const f = this.filters;

        this.filteredPromotions = this.promotions.filter(p => {

            const productName = this.productMap.get(p.productId) ?? "";

            return (
                (!f.productId || productName.toLowerCase().includes(f.productId.toLowerCase())) &&
                (!f.type || String(p.type) === f.type) &&
                (!f.value || p.value?.toString().includes(f.value)) &&
                (!f.startDate || (p.startDate && new Date(p.startDate).toISOString().slice(0, 10) === f.startDate)) &&
                (!f.endDate || (p.endDate && new Date(p.endDate).toISOString().slice(0, 10) === f.endDate))
            );
        });

        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.max(1, Math.ceil(this.filteredPromotions.length / this.pageSize));
    }

    //Modal Methods
    openPromotionAddModal() {
        this.showModal = true;
    }

    closePromotionAddModal() {
        this.showModal = false;
        this.loadPromotions();
    }

    editPromotion(promotion: Promotion): void {
        this.selectedPromotion = promotion;
        this.showModal = true;
    }

    //Methods Promotion
    deletePromotion(id: string): void {
        if (!confirm('Tem certeza que deseja excluir esta promoção?')) {
            return;
        }

        this.promotionSevice.deletePromotion(id).subscribe({
            next: () => {
                console.log('Promoção deletado com sucesso.');

                this.onPromotionDelete();
                this.loadPromotions();
            },
            error: (err) => {
                console.error('Erro ao deletar promoção:', err);
            }
        });
    }

    //Messages
    clearMessageAfterDelay() {
        setTimeout(() => {
            this.statusMessage = '';
        }, 5000);
    }

    onPromotionCreate() {
        this.statusMessage = "Promoção criada com sucesso!";
        this.statusType = "success";
        this.clearMessageAfterDelay();
        this.loadPromotions();
    }

    onPromotionDelete() {
        this.statusMessage = "Promoção deletada com sucesso!";
        this.statusType = "error";
        this.clearMessageAfterDelay();
    }

    onPromtionSaved() {
        this.statusMessage = "Promoção salva com sucesso!";
        this.statusType = "success";
        this.clearMessageAfterDelay();
        this.loadPromotions();
    }

    //Pagination Methods 
    get promotionsPaginated(): Promotion[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredPromotions.slice(start, start + this.pageSize);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

}